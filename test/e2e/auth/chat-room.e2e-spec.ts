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
import Redis from "ioredis";
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
    ConfigService,
} from "@nestjs/config";
import {
    getRedisToken,
} from "@liaoliaots/nestjs-redis";
import {
    HttpExceptionFilter,
} from "../../../src/filter/http-exception.filter";
import * as bcrypt from "bcrypt";
import {
    generateRandomPasswordFunction,
} from "../../../src/util/func/random-password.function";
import {
    memberFixture, memberRandomFixture,
} from "../../fixture/entity/member.fixture";
import {
    JwtService,
} from "@nestjs/jwt";
import * as request from "supertest";
import {
    CreateChatRoomRequestDto,
} from "../../../src/domain/chat-room/dto/request/create-chat-room.request.dto";
import {
    Member,
} from "@prisma/client";
import {
    CreateChatRoomResponseDto,
} from "../../../src/domain/chat-room/dto/response/create-chat-room.response.dto";
import CustomResponse from "src/response/custom-response";
import {
    ResponseStatus,
} from "../../../src/response/response-status";
import {
    ErrorDataDto,
} from "../../../src/response/error-data.dto";
import {
    chatRoomFixture,
} from "../../fixture/entity/chat-room.fixture";

describe("ChatRoom Test (e2e)", () => {
    let app: INestApplication<any>;
    let prismaConfig: PrismaConfig;
    let redisContainer: StartedRedisContainer;
    let postgresContainer: StartedPostgreSqlContainer;
    let jwtService: JwtService;
    let configService: ConfigService;
    let redisClient: Redis;

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
        console.log(redisClient);
        app = module.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    });

    afterAll(async () => {
        await redisContainer.stop();
        await postgresContainer.stop();
        await app.close();
    });

    beforeEach(async () => {
        await redisClient.reset();
        await prismaConfig.memberRoom.deleteMany({});
        await prismaConfig.chatRoom.deleteMany({});
        await prismaConfig.member.deleteMany({});
    });

    it("app은 정의되어야 한다. ", () => {
        expect(app).toBeDefined();
    });

    describe("createCharRoom ", () => {
        describe("인가된 Token의 사용자가 요청하면,", () => {
            describe("DTO의 값을 채우고 존재하는 member의 Ids값을 매개 값으로 제공하면, ", () => {
                it("Token의 Member가 관리자이고, Ids에 들어간 Member들로 구성되는 Chat Room 생성한다.", async () => {
                    // given
                    const currentPassword = generateRandomPasswordFunction();
                    const encryptedPassword = await bcrypt.hash(currentPassword, await bcrypt.genSalt());
                    const member = memberFixture(encryptedPassword);
                    const storeMember = await prismaConfig.member.create({
                        data: member,
                    });

                    const randomNumber = Math.ceil(Math.random() * 20);
                    const members = [];
                    for (let i = 0; i < randomNumber; i++) {
                        const randomMember = memberRandomFixture(
                            await bcrypt.hash(generateRandomPasswordFunction(), await bcrypt.genSalt()), i
                        );
                        const storedRandomMember = await prismaConfig.member.create({
                            data: randomMember,
                        });
                        members.push(storedRandomMember);
                    }

                    const token = jwtService.sign({
                        sub: storeMember.id.toString(),
                    }, {
                        secret: configService.get<string>("JWT_SECRET_KEY") ?? "secret",
                    });
                    const ids = members.map(member =>
                        member.id.toString()
                    );
                    const requestBodyDto: CreateChatRoomRequestDto = {
                        name: "Algorithm",
                        color: "Red",
                        ids: ids,
                    };

                    // when
                    const response = await request(app.getHttpServer())
                        .post("/chat-rooms")
                        .send(requestBodyDto)
                        .set("Authorization", `Bearer ${token}`)
                        .expect(HttpStatus.CREATED);

                    // then
                    const actual = response.body as CustomResponse<CreateChatRoomResponseDto>;
                    const actualChatRoom = await prismaConfig.chatRoom.findUnique({
                        where: {
                            id: BigInt(actual.data.id),
                        },
                        include: {
                            MemberRoom: {
                                include: {
                                    member: true,
                                },
                            },
                        },
                    });
                    expect(actual.customStatus).toStrictEqual(ResponseStatus.CHAT_ROOM_S001);
                    expect(actual.data.id).toBe(actualChatRoom?.id.toString());

                });
            });
            describe("DTO에서 존재하지 않는 member의 Ids값을 매개 값으로 제공하면, ", () => {
                it("잘못된 요청이라는 예외를 발생시킨다.", async () => {
                    // given
                    // Member 생성
                    const currentPassword = generateRandomPasswordFunction();
                    const encryptedPassword = await bcrypt.hash(currentPassword, await bcrypt.genSalt());
                    const member = memberFixture(encryptedPassword);
                    const storeMember = await prismaConfig.member.create({
                        data: member,
                    });

                    const randomNumber = Math.ceil(Math.random() * 20);
                    const memberIds = [];
                    for (let i = 0; i < randomNumber; i++) {
                        if (storeMember.id === BigInt(i)) continue;
                        memberIds.push(BigInt(i));
                    }

                    const token = jwtService.sign({
                        sub: storeMember.id.toString(),
                    }, {
                        secret: configService.get<string>("JWT_SECRET_KEY") ?? "secret",
                    });
                    const ids = memberIds.map(id =>
                        id.toString()
                    );
                    const requestBodyDto: CreateChatRoomRequestDto = {
                        name: "Algorithm",
                        color: "Red",
                        ids: ids,
                    };

                    // when
                    const response = await request(app.getHttpServer())
                        .post("/chat-rooms")
                        .send(requestBodyDto)
                        .set("Authorization", `Bearer ${token}`)
                        .expect(HttpStatus.BAD_REQUEST);

                    // then
                    const actual = response.body as CustomResponse<ErrorDataDto>;
                    expect(actual.customStatus).toStrictEqual(ResponseStatus.CHAT_ROOM_F001);
                });
            });
        });

        describe("토큰이 없으면,", () => {
            it("비인가 접근의 예외를 발생시킨다.", async () => {
                // given
                // Member 생성
                const requestBodyDto: CreateChatRoomRequestDto = {
                    name: "Algorithm",
                    color: "Red",
                    ids: [],
                };

                // when
                const response = await request(app.getHttpServer())
                    .post("/chat-rooms")
                    .send(requestBodyDto)
                    .expect(HttpStatus.FORBIDDEN);

                // then
                const actual = response.body as CustomResponse<ErrorDataDto>;
                expect(actual.customStatus).toStrictEqual(ResponseStatus.AUTH_F005);
            });
        });

        describe("토큰이 있지만, 유효하지 않은 토큰이라면,", () => {
            it("비인가 접근의 예외를 발생시킨다.", async () => {
                // given
                // Member 생성
                const token = jwtService.sign({
                    sub: "123",
                }, {
                    secret: "test",
                });
                const requestBodyDto: CreateChatRoomRequestDto = {
                    name: "Algorithm",
                    color: "Red",
                    ids: [],
                };

                // when
                const response = await request(app.getHttpServer())
                    .post("/chat-rooms")
                    .send(requestBodyDto)
                    .set("Authorization", `Bearer ${token}`)
                    .expect(HttpStatus.FORBIDDEN);

                // then
                const actual = response.body as CustomResponse<ErrorDataDto>;
                expect(actual.customStatus).toStrictEqual(ResponseStatus.AUTH_F005);

            });
        });

        describe("인가된 Token의 사용자가 요청하면,", () => {
            describe("Query Param을 전달하지 않으면, ", () => {
                it("회원이 속해있는 전체 채팅방 목록이 반환된다.", async () => {
                    // given
                    const currentPassword = generateRandomPasswordFunction();
                    const encryptedPassword = await bcrypt.hash(currentPassword, await bcrypt.genSalt());
                    const member = memberFixture(encryptedPassword);
                    const storeMember = await prismaConfig.member.create({
                        data: member,
                    });

                    const randomNumber = Math.ceil(Math.random() * 20);
                    const members = [];
                    for (let i = 0; i < randomNumber; i++) {
                        const randomMember = memberRandomFixture(
                            await bcrypt.hash(generateRandomPasswordFunction(), await bcrypt.genSalt()), i
                        );
                        const storedRandomMember = await prismaConfig.member.create({
                            data: randomMember,
                        });
                        members.push(storedRandomMember);
                    }

                    const chatRoomName = "Algorithm";
                    for (let i = 0; i < randomNumber; i++) {
                        let chatRoom;
                        if (i % 2 === 0) {
                            chatRoom = chatRoomFixture(chatRoomName, storeMember.id, members.map(member => member.id));
                        } else {
                            chatRoom = chatRoomFixture(chatRoomName, members[i].id, members.map(member => member.id));
                        }

                        // await prismaConfig.chatRoom.create({
                        //     data: chatRoom,
                        // });
                    }

                    const token = jwtService.sign({
                        sub: storeMember.id.toString(),
                    }, {
                        secret: configService.get<string>("JWT_SECRET_KEY") ?? "secret",
                    });
                });
            });
        });
    });
    // describe("getChatRoomList", () => {
    //     describe("인가된 Token의 사용자가 요청하면,", () => {
    //         describe("Query Param을 전달하지 않으면, ", () => {
    //             it("회원이 속해있는 전체 채팅방 목록이 반환된다.", async () => {
    //                 // given
    //                 const currentPassword = generateRandomPasswordFunction();
    //                 const encryptedPassword = await bcrypt.hash(currentPassword, await bcrypt.genSalt());
    //                 const member = memberFixture(encryptedPassword);
    //                 const storeMember = await prismaConfig.member.create({
    //                     data: member,
    //                 });
    //
    //                 const randomNumber = Math.ceil(Math.random() * 20);
    //                 const members = [];
    //                 for (let i = 0; i < randomNumber; i++) {
    //                     const randomMember = memberRandomFixture(
    //                         await bcrypt.hash(generateRandomPasswordFunction(), await bcrypt.genSalt()), i
    //                     );
    //                     const storedRandomMember = await prismaConfig.member.create({
    //                         data: randomMember,
    //                     });
    //                     members.push(storedRandomMember);
    //                 }
    //
    //                 const chatRoomName = "Algorithm";
    //                 for (let i = 0; i < randomNumber; i++) {
    //                     let chatRoom;
    //                     if (i % 2 === 0) {
    //                         chatRoom = chatRoomFixture(chatRoomName, storeMember.id, members.map(member => member.id));
    //                     } else {
    //                         chatRoom = chatRoomFixture(chatRoomName, members[i].id, members.map(member => member.id));
    //                     }
    //
    //                     // await prismaConfig.chatRoom.create({
    //                     //     data: chatRoom,
    //                     // });
    //                 }
    //
    //                 const token = jwtService.sign({
    //                     sub: storeMember.id.toString(),
    //                 }, {
    //                     secret: configService.get<string>("JWT_SECRET_KEY") ?? "secret",
    //                 });
    //             });
    //         });
    //     });
    // });
});