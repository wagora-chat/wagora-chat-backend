import AuthController from "../auth.controller";
import {
    Test, TestingModule,
} from "@nestjs/testing";
import AuthService from "../auth.service";
import SignupDtoGenerator from "./signup-dto.generator";
import {
    ResponseCode,
} from "../../../response/response-code.enum";

const serviceMock = {
    signup: jest.fn(),
};

describe("AuthController", () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController,],
            providers: [{
                provide: AuthService,
                useValue: serviceMock,
            },],
        }).compile();

        authController = module.get(AuthController);
    });

    const signupRequestDto = SignupDtoGenerator.request();
    const response = SignupDtoGenerator.response();

    describe("Signup", () => {
        it("AuthController의 인스턴스가 정상적으로 정의되어야 한다.", async () => {
            expect(authController).toBeDefined();
        });

        it("성공 코드와 함께 새로 생성된 회원의 ID가 반환된다.", async () => {
            serviceMock.signup.mockResolvedValue(response);

            const result = await authController.signup(signupRequestDto);

            expect(result).not.toBeNull();
            expect(result.data.id).toBe(response.id);
            expect(result.code).toBe(ResponseCode.AUTH_S001);
        });
    });
});