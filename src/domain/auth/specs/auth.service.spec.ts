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
import SignupDtoGenerator from "./signup-dto.generator";
import MemberEntityGenerator from "./member-entity.generator";

const prismaMock = {
    member: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
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
            ],
        }).compile();

        authService = module.get(AuthService);
    });

    const signupRequestDto = SignupDtoGenerator.request();
    const member = MemberEntityGenerator.member();

    describe("Signup", () => {
        it("AuthService의 인스턴스가 정상적으로 정의되어야 한다.", async () => {
            expect(authService).toBeDefined();
        });

        it("새로운 회원의 아이디가 생성되어야 한다.", async () => {
            prismaMock.member.findUnique.mockResolvedValue(null);
            prismaMock.member.create.mockResolvedValue(member);

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
});