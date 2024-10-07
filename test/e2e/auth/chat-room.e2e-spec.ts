import {
    HttpStatus, INestApplication,
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
    memberFixture, memberRandomListFixture,
} from "../../fixture/entity/member.fixture";
import {
    JwtService,
} from "@nestjs/jwt";
import * as request from "supertest";
import {
    CreateChatRoomRequestDto,
} from "../../../src/domain/chat-room/dto/request/create-chat-room.request.dto";
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
import GetChatRoomListResponseDto from "../../../src/domain/chat-room/dto/response/get-chat-room-list.response.dto";
import {
    LeaveChatRoomResponseDto,
} from "../../../src/domain/chat-room/dto/response/leave-chat-room.response.dto";
import {
    Member,
} from "@prisma/client";

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
        await prismaConfig.memberRoom.deleteMany({});
        await prismaConfig.chatRoom.deleteMany({});
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

    describe("Invalid Authenticate", () => {
        describe("인가되지 않은 사용자의 요청이면", () => {
            it("비인가 접근의 예외를 발생시킨다.", async () => {
                // given
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
    });

    describe("createChatRoom ", () => {
        describe("DTO의 값을 채우고 존재하는 member의 Ids값을 매개 값으로 제공하면, ", () => {
            it("Token의 Member가 관리자이고, Ids에 들어간 Member들로 구성되는 Chat Room 생성한다.", async () => {
                // given
                const ids = members.map(member =>
                    member!.id.toString()
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
                const randomNumber = Math.ceil(Math.random() * 20);
                const memberIds = [];
                for (let i = 0; i < randomNumber; i++) {
                    if (storeMember.id === BigInt(i)) continue;
                    memberIds.push(BigInt(i));
                }

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

    describe("getChatRoomList", () => {
        describe("Query Param을 전달하지 않으면, ", () => {
            it("회원이 속해있는 전체 채팅방 목록이 반환된다.", async () => {
                // given
                const chatRoomName = "Algorithm";
                let containsRoomCount = 0;
                for (let i = 0; i < members.length; i++) {
                    const managerId: bigint = i % 2 === 0 ? storeMember.id : members[i]!.id;
                    const chatRoom =
                        chatRoomFixture(
                            chatRoomName, managerId, members.filter(member => member!.id !== managerId)
                                .map(member => member!.id)
                        );

                    await prismaConfig.chatRoom.create({
                        data: chatRoom,
                    });

                    if (managerId === storeMember.id) containsRoomCount++;
                }

                // when
                const response = await request(app.getHttpServer())
                    .get("/chat-rooms")
                    .set("Authorization", `Bearer ${token}`)
                    .expect(HttpStatus.OK);

                // then
                const actual = response.body as CustomResponse<GetChatRoomListResponseDto[]>;
                expect(actual.customStatus).toStrictEqual(ResponseStatus.CHAT_ROOM_S002);
                expect(actual.data.length).toBe(containsRoomCount);
            });
        });

        describe("Query Param에 name 파라미터를 전달하면", () => {
            it("자신인 속한 채팅방 중, name 이 제목에 들어간 채팅방 목록이 반환된다.", async () => {
                // given
                const randomNumber = Math.ceil(Math.random() * 10);
                const chatRoomName = "Algorithm";
                for (let i = 0; i < randomNumber; i++) {
                    const chatRoom = chatRoomFixture(
                        chatRoomName, storeMember.id, members.map(member => member!.id)
                    );

                    await prismaConfig.chatRoom.create({
                        data: chatRoom,
                    });
                }

                const anotherChatRoomName = "Database";
                const anotherChatRoom = chatRoomFixture(
                    anotherChatRoomName, storeMember.id, []
                );
                await prismaConfig.chatRoom.create({
                    data: anotherChatRoom,
                });

                // when
                const response = await request(app.getHttpServer())
                    .get("/chat-rooms")
                    .query({
                        name: chatRoomName,
                    })
                    .set("Authorization", `Bearer ${token}`)
                    .expect(HttpStatus.OK);

                // then
                const actual = response.body as CustomResponse<GetChatRoomListResponseDto[]>;
                expect(actual.customStatus).toStrictEqual(ResponseStatus.CHAT_ROOM_S002);
                expect(actual.data.length).toBe(randomNumber);
            });
        });

        describe("Query Param에 members 파라미터를 전달하면", () => {
            it("자신이 속한 채팅방 중, members 의 회원들이 같이 포함된 채팅방 목록이 반환된다.", async () => {
                // given
                const searchMembers = members.slice(0, members.length / 2).map(member => member!.id);
                const noSearchMembers = members.slice(members.length / 2).map(member => member!.id);

                const randomNumber = Math.ceil(Math.random() * 10);
                const chatRoomName = "Algorithm";
                let containsRoomCount = 0;
                for (let i = 0; i < randomNumber; i++) {
                    const inviteMembers = i % 2 === 0 ? searchMembers : noSearchMembers;
                    const chatRoom = chatRoomFixture(
                        chatRoomName, storeMember.id, inviteMembers
                    );

                    await prismaConfig.chatRoom.create({
                        data: chatRoom,
                    });

                    if (inviteMembers === searchMembers) containsRoomCount++;
                }

                // when
                const response = await request(app.getHttpServer())
                    .get("/chat-rooms")
                    .query({
                        members: searchMembers,
                    })
                    .set("Authorization", `Bearer ${token}`)
                    .expect(HttpStatus.OK);

                // then
                const actual = response.body as CustomResponse<GetChatRoomListResponseDto[]>;
                expect(actual.customStatus).toStrictEqual(ResponseStatus.CHAT_ROOM_S002);
                expect(actual.data.length).toBe(containsRoomCount);
            });
        });

        describe("Query Param에 name과 members 모두를 전달하면", () => {
            it("잘못된 요청이므로 예외를 발생시켜야 한다.", async () => {
                // given

                // when
                const response = await request(app.getHttpServer())
                    .get("/chat-rooms")
                    .query({
                        name: "Hello",
                        members: [2,
                            3,
                            4,],
                    })
                    .set("Authorization", `Bearer ${token}`)
                    .expect(HttpStatus.BAD_REQUEST);

                // then
                const actual = response.body as CustomResponse<ErrorDataDto>;
                expect(actual.customStatus).toStrictEqual(ResponseStatus.CHAT_ROOM_F002);
            });
        });
    });
    describe("leaveChatRoom", () => {
        describe("해당 채팅방에 소속되어 있으면", () => {
            describe("관리자가 아니면", () => {
                it("채팅방에서 나갈 수 있다.", async () => {
                    // given
                    const chatRoomName = "Algorithm";
                    const managerId = members[0]!.id;
                    const memberIds = members.map(member => member!.id);
                    memberIds.push(storeMember.id);

                    const chatRoom = chatRoomFixture(
                        chatRoomName, managerId, memberIds.filter(id => id !== managerId)
                    );

                    const storedChatRoom = await prismaConfig.chatRoom.create({
                        data: chatRoom,
                    });

                    // when
                    const response = await request(app.getHttpServer())
                        .delete(`/chat-rooms/${storedChatRoom.id.toString()}`)
                        .set("Authorization", `Bearer ${token}`)
                        .expect(HttpStatus.OK);

                    // then
                    const actual = response.body as CustomResponse<LeaveChatRoomResponseDto>;
                    expect(actual.customStatus.code).toStrictEqual(ResponseStatus.CHAT_ROOM_S003.code);
                    const actualChatRoom = await prismaConfig.chatRoom.findUnique({
                        where: {
                            id: storedChatRoom.id,
                        },
                        include: {
                            MemberRoom: true,
                        },
                    });
                    expect(true).toBe(actualChatRoom?.MemberRoom.some(
                        memberRoom => memberRoom.memberId !== storeMember.id)
                    );
                });
            });
            describe("관리자이면, ", () => {
                describe("혼자 남은 경우,", () => {
                    it("채팅방을 나가고, 채팅방도 삭제해야 한다. ", async () => {
                        // given
                        const chatRoomName = "Algorithm";
                        const managerId = storeMember.id;

                        const chatRoom = chatRoomFixture(
                            chatRoomName, managerId, []
                        );

                        const storedChatRoom = await prismaConfig.chatRoom.create({
                            data: chatRoom,
                        });

                        // when
                        const response = await request(app.getHttpServer())
                            .delete(`/chat-rooms/${storedChatRoom.id.toString()}`)
                            .set("Authorization", `Bearer ${token}`)
                            .expect(HttpStatus.OK);

                        // then
                        const actual = response.body as CustomResponse<LeaveChatRoomResponseDto>;
                        expect(actual.customStatus.code).toStrictEqual(ResponseStatus.CHAT_ROOM_S003.code);
                        const actualChatRoom = await prismaConfig.chatRoom.findUnique({
                            where: {
                                id: storedChatRoom.id,
                            },
                            include: {
                                MemberRoom: true,
                            },
                        });
                        expect(actualChatRoom).toBeNull();
                    });
                });

                describe("혼자 남지 않은 경우,", () => {
                    it("혼자 남지 않으면 채팅방을 나갈 수 없는 예외를 발생시켜야 한다. ", async () => {
                        // given
                        const chatRoomName = "Algorithm";
                        const managerId = storeMember.id;
                        const memberIds = members.map(member => member!.id);
                        const chatRoom = chatRoomFixture(
                            chatRoomName, managerId, memberIds.filter(id => id !== managerId)
                        );
                        const storedChatRoom = await prismaConfig.chatRoom.create({
                            data: chatRoom,
                        });

                        // when
                        const response = await request(app.getHttpServer())
                            .delete(`/chat-rooms/${storedChatRoom.id.toString()}`)
                            .set("Authorization", `Bearer ${token}`)
                            .expect(HttpStatus.BAD_REQUEST);

                        // then
                        const actual = response.body as CustomResponse<ErrorDataDto>;
                        expect(actual.customStatus).toStrictEqual(ResponseStatus.CHAT_ROOM_F005);

                    });
                });
            });
        });

    });
});