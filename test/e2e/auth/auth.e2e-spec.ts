import {
    Test,
    TestingModule,
} from "@nestjs/testing";
import {
    StartedRedisContainer,
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
    ResponseStatus,
} from "../../../src/response/response-status";
import {
    ConfigService,
} from "@nestjs/config";
import {
    redisTestContainerStarter,
} from "../../../src/util/func/redis-container.function";
import {
    PrismaConfig,
} from "../../../src/prisma/prisma.config";
import {
    StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import {
    psqlTestContainerStarter,
} from "../../../src/util/func/postgresql-container.function";

describe("Auth Test (e2e)", () => {
    let app: INestApplication<any>;
    let prismaConfig: PrismaConfig;
    let redisContainer: StartedRedisContainer;
    let postgresContainer: StartedPostgreSqlContainer;
    let redisClient: Redis;

    beforeAll(async () => {
        // TODO: prisma container에 prima migrate 진행 + 정보 반환
        const psqlConfig = await psqlTestContainerStarter();
        postgresContainer = psqlConfig.container;
        prismaConfig = psqlConfig.service;
        redisContainer = await redisTestContainerStarter();

        // TODO: AppModule 받아오기. env 파일을 반영하지 않도록 하므로 환경변수 직접 지정
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule,],
        }).overrideProvider(PrismaConfig)
            .useValue(prismaConfig)
            .overrideProvider(ConfigService)
            .useValue({
                get: (key: string) => {
                    if (key === "REDIS_HOST") return redisContainer.getHost();
                    if (key === "REDIS_PORT") return redisContainer.getPort();

                    return null;
                },
            })
            .compile();

        redisClient = module.get<Redis>(getRedisToken("default"));
        app = module.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    });

    // TODO: App 종료 후, 컨테이너도 종료
    afterAll(async () => {
        await app.close();
        await redisContainer.stop();
        await postgresContainer.stop();
    });

    // TODO: 컨테이너 내부 값 삭제(초기화)
    beforeEach(async () => {
        await redisClient.reset();
        await prismaConfig.member.deleteMany({});
    });

    describe("confirmValidateCode Test", () => {
        it("해당 Email에 저장된 Code를 받으면 요청한 email을 반환한다.", async () => {
            // given
            const expectedUserEmail = "test1234@gmail.com";
            const expectedCode = "123456";
            await redisClient.set(`validateEmail-${expectedUserEmail}`, expectedCode);
            const requestBody: VerifyCodeEmailRequestDto = {
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
            expect(actual.customStatus).toStrictEqual(ResponseStatus.AUTH_S003);
            expect(actual.data.email).toBe(expectedUserEmail);
        });

        it("해당 Email에 저장된 Code가 아닌 경우 email 인증이 실패했다는 예외를 발생시킨다..", async () => {
            // given
            const expectedUserEmail = "test1234@gmail.com";
            const expectedCode = "123456";
            const expectedPath = "/auth/emails/confirm";
            await redisClient.set(`validateEmail-${expectedUserEmail}`, expectedCode);
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
            expect(actual.customStatus).toStrictEqual(ResponseStatus.AUTH_F003);
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
            expect(actual.customStatus).toStrictEqual(ResponseStatus.AUTH_F003);
            expect(actual.data.path).toBe(expectedPath);
        });
    });
});