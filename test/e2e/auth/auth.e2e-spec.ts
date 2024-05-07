import {
    Test,
    TestingModule,
} from "@nestjs/testing";
import {
    RedisContainer, StartedRedisContainer,
} from "@testcontainers/redis";
import {
    HttpExceptionFilter,
} from "../../../src/filter/http-exception.filter";
import {
    ForbiddenException,
    HttpStatus,
    INestApplication,
} from "@nestjs/common";
import Redis from "ioredis";
import * as request from "supertest";
import {
    SendCodeToEmailRequest,
} from "../../../src/domain/auth/controller/dto/req/send-code-to-email.request";
import {
    SendCodeToEmailResponse,
} from "../../../src/domain/auth/controller/dto/res/send-code-to-email.response";
import {
    ResponseCode,
} from "../../../src/exception/error-code.enum";
import {
    getRedisToken,
    RedisModule,
} from "@liaoliaots/nestjs-redis";
import {
    AppModule,
} from "../../../src/app.module";
import {
    VerifyCodeEmailRequest,
} from "../../../src/domain/auth/controller/dto/req/verify-code-email-request";
import {
    VerifyCodeEmailResponse,
} from "../../../src/domain/auth/controller/dto/res/verify-code-email.response";
import {
    ErrorData,
} from "../../../src/exception/error-data";
import {
    ErrorObject,
} from "../../../src/exception/error-object";

describe("Auth Test (e2e)", () => {
    let app: INestApplication<any>;
    let redisContainer: StartedRedisContainer;
    let redisClient: Redis;

    beforeAll(async () => {
        redisContainer = await new RedisContainer().start();

        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule,],
        }).overrideModule(RedisModule)
            .useModule(RedisModule.forRoot({
                readyLog: true,
                config: {
                    host: redisContainer.getHost(),
                    port: redisContainer.getPort(),
                },
            }))
            .compile();

        redisClient = module.get<Redis>(getRedisToken("default"));
        app = module.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await redisContainer.stop();
    });

    beforeEach(async () => {
        await redisClient.reset();
    });

    // TODO: email 전송과 같은 외부 요청을 포함하는 테스트 절차 논의
    // describe("transferValidateCode Test", () => {
    //     it("이메일 전송 요청이 오면, 해당 이메일을 전송하고 Redis에 이메일에 대한 Code를 저장해야 한다.", async () => {
    //         // given
    //         const requestBody = new SendCodeToEmailRequest(
    //             "lxx3380@gmail.com"
    //         );
    //
    //         // when
    //         const response = await request(app.getHttpServer())
    //             .post("/auth/emails")
    //             .send(requestBody)
    //             .expect(HttpStatus.CREATED);
    //
    //         // then
    //         const actual = response.body as SendCodeToEmailResponse;
    //         expect(actual.code).toBe(ResponseCode.AUTH_S002);
    //     });
    // });

    describe("confirmValidateCode Test", () => {
        it("해당 Email에 저장된 Code를 받으면 요청한 email을 반환한다.", async () => {
            // given
            const expectedUserEmail = "test1234@gmail.com";
            const expectedCode = "123456";
            await redisClient.set(expectedUserEmail, expectedCode);
            const requestBody = new VerifyCodeEmailRequest(expectedUserEmail, expectedCode);

            // when
            const response = await request(app.getHttpServer())
                .post("/auth/emails/confirm")
                .send(requestBody)
                .expect(HttpStatus.CREATED);

            // then
            const actual = response.body as VerifyCodeEmailResponse;
            expect(actual.code).toBe(ResponseCode.AUTH_S003);
            expect(actual.data.email).toBe(expectedUserEmail);
        });

        it("해당 Email에 저장된 Code가 아닌 경우 email 인증이 실패했다는 예외를 발생시킨다..", async () => {
            // given
            const expectedUserEmail = "test1234@gmail.com";
            const expectedCode = "123456";
            const expectedPath = "/auth/emails/confirm";
            await redisClient.set(expectedUserEmail, expectedCode);
            const invalidCode = "654321";
            const requestBody = new VerifyCodeEmailRequest(expectedUserEmail, invalidCode);

            // when
            const response = await request(app.getHttpServer())
                .post("/auth/emails/confirm")
                .send(requestBody)
                .expect(HttpStatus.FORBIDDEN);

            // then
            const actual = response.body as ErrorObject;
            expect(actual.code).toBe(ResponseCode.AUTH_F003);
            expect(actual.data.path).toBe(expectedPath);
        });

        it("해당 Email이 저장되어 있지 않은 경우 email 인증이 실패했다는 예외를 발생시킨다..", async () => {
            // given
            const expectedUserEmail = "test1234@gmail.com";
            const expectedPath = "/auth/emails/confirm";
            const invalidCode = "654321";
            const requestBody = new VerifyCodeEmailRequest(expectedUserEmail, invalidCode);

            // when
            const response = await request(app.getHttpServer())
                .post("/auth/emails/confirm")
                .send(requestBody)
                .expect(HttpStatus.FORBIDDEN);

            // then
            const actual = response.body as ErrorObject;
            expect(actual.code).toBe(ResponseCode.AUTH_F003);
            expect(actual.data.path).toBe(expectedPath);
        });
    });
});