import AuthService from "../auth.service";
import {
    Test, TestingModule,
} from "@nestjs/testing";
import {
    PrismaConfig,
} from "../../../prisma/prisma.config";
import {
    DuplicateEmailException,
} from "../../../exception/http/duplicate-email.exception";
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
        it("should be defined", async () => {
            expect(authService).toBeDefined();
        });

        it("should return new member id", async () => {
            prismaMock.member.findUnique.mockResolvedValue(null);
            prismaMock.member.create.mockResolvedValue(member);

            const result = await authService.signup(signupRequestDto);

            expect(result).not.toBeNull();
            expect(result.id).toBe(member.id.toString());
        });

        it("should throw duplicate property exception when request exists email", async () => {
            prismaMock.member.findUnique.mockResolvedValue(member);

            try {
                await authService.signup(signupRequestDto);
            } catch (error) {
                expect(error).toBeInstanceOf(DuplicateEmailException);
            }
        });
    });
});