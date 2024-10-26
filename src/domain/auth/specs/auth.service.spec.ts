import AuthService from "../auth.service";
import {
    Test, TestingModule,
} from "@nestjs/testing";
import {
    PrismaConfig,
} from "../../../prisma/prisma.config";
import {
    DuplicateEmailException,
} from "../../../exception/duplicate-email.exception";
import SignupDtoGenerator from "./generators/signup-dto.generator";
import MemberEntityGenerator from "./generators/member-entity.generator";
import CheckDuplicateNicknameParamsDtoGenerator from "./generators/check-duplicate-nickname.params.dto.generator";
import {
    getRedisToken,
} from "@liaoliaots/nestjs-redis";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    ConfigService,
} from "@nestjs/config";
import FileEntityGenerator from "./generators/file-entity.generator";

const prismaMock = {
    member: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    file: {
        findUnique: jest.fn(),
    },
};
const clientMock = {
    get: jest.fn(),
    del: jest.fn(),
};
const jwtServiceMock = {
    sign: jest.fn(),
};

const configServiceMock = {
    get: jest.fn(),
};

describe("AuthService", () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaConfig,
                    useValue: prismaMock,
                },
                {
                    provide: getRedisToken("default"),
                    useValue: clientMock,
                }, // Redis 클라이언트 주입
                {
                    provide: JwtService,
                    useValue: jwtServiceMock,
                },
                {
                    provide: ConfigService,
                    useValue: configServiceMock,
                },
            ],
        }).compile();

        authService = module.get(AuthService);
    });

    const paramsDto =  CheckDuplicateNicknameParamsDtoGenerator.request();
    const signupRequestDto = SignupDtoGenerator.request();
    const member = MemberEntityGenerator.member();
    const file = FileEntityGenerator.file();

    describe("Signup", () => {
        it("AuthService의 인스턴스가 정상적으로 정의되어야 한다.", async () => {
            expect(authService).toBeDefined();
        });

        it("새로운 회원의 아이디가 생성되어야 한다.", async () => {
            prismaMock.member.findUnique.mockResolvedValue(null);
            prismaMock.member.create.mockResolvedValue(member);
            prismaMock.file.findUnique.mockResolvedValue(file);
            clientMock.get.mockResolvedValue("validate");

            const result = await authService.signup(signupRequestDto);

            expect(result).not.toBeNull();
            expect(result.id).toBe(member.id.toString());
        });

        it("이미 존재하는 이메일에 대해 에러를 발생시킨다.", async () => {
            prismaMock.member.findUnique.mockResolvedValue(member);

            try {
                await authService.signup(signupRequestDto);
            } catch (error) {
                expect(error).toBeInstanceOf(DuplicateEmailException);
            }
        });
    });

    describe("Check Duplicate Nickname", () => {
        it("존재하지 않는 닉네임에 대해 true 응답을 반환한다.", async () => {
            prismaMock.member.findUnique.mockResolvedValue(member);

            const result = await authService.checkDuplicateNickname(paramsDto);

            expect(result).not.toBeNull();
            expect(result).toBeTruthy();
        });
    });
});