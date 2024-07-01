import AuthController from "../auth.controller";
import {
    Test, TestingModule,
} from "@nestjs/testing";
import AuthService from "../auth.service";
import SignupDtoGenerator from "./generators/signup-dto.generator";
import {
    EmailService,
} from "../email.service";
import SendCodeToEmailDtoGenerator from "./generators/send-code-to-email-dto.generator";
import {
    ResponseStatus,
} from "../../../response/response-status";

const authServiceMock = {
    signup: jest.fn(),
    checkDuplicateNickname: jest.fn(),
};
const emailServiceMock = {
    transferValidateCode: jest.fn(),
    confirmValidateCode: jest.fn(),
};

describe("AuthController", () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController,],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceMock,
                },
                {
                    provide: EmailService,
                    useValue: emailServiceMock,
                },
            ],
        }).compile();
        authController = module.get(AuthController);
    });

    const signupRequestDto = SignupDtoGenerator.request();
    const signupResponseDto = SignupDtoGenerator.response();
    const sendCodeToEmailRequestDto = SendCodeToEmailDtoGenerator.request();
    const sendCodeToEmailResponseDto = SendCodeToEmailDtoGenerator.response(sendCodeToEmailRequestDto.email);
    const checkDuplicateNicknameParamsDto = SignupDtoGenerator.request();
    const checkDuplicateNicknameResponseDto = SignupDtoGenerator.response();

    describe("Signup", () => {
        it("AuthController의 인스턴스가 정상적으로 정의되어야 한다.", async () => {
            expect(authController).toBeDefined();
        });

        it("성공 코드와 함께 새로 생성된 회원의 ID가 반환된다.", async () => {
            authServiceMock.signup.mockResolvedValue(signupResponseDto);

            const result = await authController.signup(signupRequestDto);

            expect(result).not.toBeNull();
            expect(result.data.id).toBe(signupResponseDto.id);
            expect(result.customStatus).toBe(ResponseStatus.AUTH_S001);
        });
    });

    describe("transferValidateCode", () => {
        it("AuthController의 인스턴스가 정상적으로 정의되어야 한다.", async () => {
            expect(authController).toBeDefined();
        });

        it("성공 코드와 생성된 회원의 Email이 반환된다.", async () => {
            emailServiceMock.transferValidateCode.mockResolvedValue(sendCodeToEmailResponseDto);

            const result = await authController.transferValidateCode(sendCodeToEmailRequestDto);

            expect(result).not.toBeNull();
            expect(result.data.email).toBe(sendCodeToEmailRequestDto.email);
            expect(result.customStatus).toBe(ResponseStatus.AUTH_S002);
        });
    });

    describe("CheckDuplicateNickname", () => {
        it("중복되지 않은 닉네임에 대해 true가 반환된다.", async () => {
            authServiceMock.checkDuplicateNickname.mockResolvedValue(checkDuplicateNicknameResponseDto);

            const result = await authController.checkDuplicateNickname(checkDuplicateNicknameParamsDto);

            expect(result).not.toBeNull();
            expect(result.customStatus).toBe(ResponseStatus.AUTH_S004);
        });
    });
});