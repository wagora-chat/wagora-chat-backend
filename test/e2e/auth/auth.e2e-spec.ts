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
    HttpStatus,
    INestApplication,
} from "@nestjs/common";
import Redis from "ioredis";
import * as request from "supertest";
import {
    getRedisToken,
    RedisModule,
} from "@liaoliaots/nestjs-redis";
import {
    AppModule,
} from "../../../src/app.module";
import {
    VerifyCodeEmailRequestDto,
} from "../../../src/domain/auth/dto/req/verify-code-email.request.dto";
import {
    VerifyCodeEmailResponseDto,
} from "../../../src/domain/auth/dto/res/verify-code-email.response.dto";
import CustomResponse from "../../../src/response/custom-response";
import {
    ErrorDataDto,
} from "../../../src/response/error-data.dto";
import {
    ResponseCode,
} from "../../../src/response/code-structure";

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

    describe("confirmValidateCode Test", () => {
        it("해당 Email에 저장된 Code를 받으면 요청한 email을 반환한다.", async () => {
            // given
            const expectedUserEmail = "test1234@gmail.com";
            const expectedCode = "123456";
            await redisClient.set("validateEmail-"+expectedUserEmail, expectedCode);
            const requestBody: VerifyCodeEmailRequestDto =  {
                email: expectedUserEmail,
                code: expectedCode,
            };

            // when
            const response = await request(app.getHttpServer())
                .post("/auth/emails/confirm")
                .send(requestBody)
                .expect(HttpStatus.CREATED);

            // then
            const actual = response.body as CustomResponse<VerifyCodeEmailResponseDto>;
            expect(actual.code).toBe(ResponseCode.AUTH_S003.code);
            expect(actual.data.email).toBe(expectedUserEmail);
        });

        it("해당 Email에 저장된 Code가 아닌 경우 email 인증이 실패했다는 예외를 발생시킨다..", async () => {
            // given
            const expectedUserEmail = "test1234@gmail.com";
            const expectedCode = "123456";
            const expectedPath = "/auth/emails/confirm";
            await redisClient.set("validateEmail-"+expectedUserEmail, expectedCode);
            const invalidCode = "654321";
            const requestBody: VerifyCodeEmailRequestDto = {
                email: expectedUserEmail,
                code: invalidCode,
            };

            // when
            const response = await request(app.getHttpServer())
                .post("/auth/emails/confirm")
                .send(requestBody)
                .expect(HttpStatus.FORBIDDEN);

            // then
            const actual = response.body as CustomResponse<ErrorDataDto>;
            expect(actual.code).toBe(ResponseCode.AUTH_F003.code);
            expect(actual.data.path).toBe(expectedPath);
        });

        it("해당 Email이 저장되어 있지 않은 경우 email 인증이 실패했다는 예외를 발생시킨다..", async () => {
            // given
            const expectedUserEmail = "test1234@gmail.com";
            const expectedPath = "/auth/emails/confirm";
            const invalidCode = "654321";
            const requestBody: VerifyCodeEmailRequestDto = {
                email: expectedUserEmail,
                code: invalidCode,
            };
            // when
            const response = await request(app.getHttpServer())
                .post("/auth/emails/confirm")
                .send(requestBody)
                .expect(HttpStatus.FORBIDDEN);

            // then
            const actual = response.body as CustomResponse<ErrorDataDto>;
            expect(actual.code).toBe(ResponseCode.AUTH_F003.code);
            expect(actual.data.path).toBe(expectedPath);
        });
    });
});