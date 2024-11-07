import {
    HttpStatus,
    INestApplication,
} from "@nestjs/common";
import {
    PrismaConfig,
} from "../../../src/prisma/prisma.config";
import {
    StartedRedisContainer,
} from "@testcontainers/redis";
import {
    StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    ConfigService,
} from "@nestjs/config";
import Redis from "ioredis";
import {
    Member,
} from "@prisma/client";
import {
    psqlTestContainerStarter,
} from "../../../src/util/func/postgresql-container.function";
import {
    redisTestContainerStarter,
} from "../../../src/util/func/redis-container.function";
import {
    Test, TestingModule,
} from "@nestjs/testing";
import {
    AppModule,
} from "../../../src/app.module";
import {
    getRedisToken,
} from "@liaoliaots/nestjs-redis";
import {
    HttpExceptionFilter,
} from "../../../src/filter/http-exception.filter";
import {
    generateRandomPasswordFunction,
} from "../../../src/util/func/random-password.function";
import * as bcrypt from "bcrypt";
import {
    memberFixture, memberRandomListFixture,
} from "../../fixture/entity/member.fixture";
import * as request from "supertest";
import FindAllMemberListResponseDto from "../../../src/domain/member/dto/find-all-member-list.response.dto";
import {
    ErrorDataDto,
} from "../../../src/response/error-data.dto";
import CustomResponse from "src/response/custom-response";
import {
    ResponseStatus,
} from "../../../src/response/response-status";

describe("ChatRoom Test (e2e)", () => {
    let app: INestApplication<any>;
    let prismaConfig: PrismaConfig;
    let redisContainer: StartedRedisContainer;
    let postgresContainer: StartedPostgreSqlContainer;
    let jwtService: JwtService;
    let configService: ConfigService;
    let redisClient: Redis;
    let storeMember: Member;
    let token: string;
    let members: Array<Member | null>;

    beforeAll(async () => {
        const psqlConfig = await psqlTestContainerStarter();
        postgresContainer = psqlConfig.container;
        prismaConfig = psqlConfig.service;
        redisContainer = await redisTestContainerStarter();

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

        configService = module.get<ConfigService>(ConfigService);
        jwtService = module.get<JwtService>(JwtService);

        redisClient = module.get<Redis>(getRedisToken("default"));
        app = module.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await redisContainer.stop();
        await postgresContainer.stop();
    });

    beforeEach(async () => {
        await redisClient.reset();
        await prismaConfig.member.deleteMany({});

        // Generate Request Member
        const currentPassword = generateRandomPasswordFunction();
        const encryptedPassword = await bcrypt.hash(currentPassword, await bcrypt.genSalt());
        const member = memberFixture(encryptedPassword);
        storeMember = await prismaConfig.member.create({
            data: member,
        });

        // Generate AccessToken
        token = jwtService.sign({
            sub: storeMember.id.toString(),
        }, {
            secret: configService.get<string>("JWT_SECRET_KEY") ?? "secret",
        });

        // Generate Invite Members
        const memberRandomList = memberRandomListFixture(
            await bcrypt.hash(generateRandomPasswordFunction(), await bcrypt.genSalt()), Math.ceil(Math.random() * 20)
        );
        members = await prismaConfig.member.createManyAndReturn({
            data: memberRandomList,
        });
    });

    it("app은 정의되어야 한다. ", () => {
        expect(app).toBeDefined();
    });

    describe("findAllMemberList ", () => {
        describe("인증된 회원은 ", () => {
            it("전체 회원 목록을 조회할 수 있다.", async () => {
                // given
                // when
                const response = await request(app.getHttpServer())
                    .get("/members")
                    .set("Authorization", `Bearer ${token}`)
                    .expect(HttpStatus.OK);

                // then
                const actual = response.body as CustomResponse<FindAllMemberListResponseDto[]>;
                expect(actual.customStatus).toStrictEqual(ResponseStatus.MEMBER_S001);
            });
        });

        describe("인증되지 않은 회원은", () => {
            it("회원 목록을 조회할 수 없다.", async () => {
                // given
                // when
                const response = await request(app.getHttpServer())
                    .get("/members")
                    .expect(HttpStatus.UNAUTHORIZED);

                // then
                const actual = response.body as CustomResponse<ErrorDataDto>;
                expect(actual.customStatus).toStrictEqual(ResponseStatus.AUTH_F005);
            });
        });
    });
    
});