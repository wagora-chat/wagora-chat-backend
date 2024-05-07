import AuthController from "../auth.controller";
import {
    Test,
    TestingModule,
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
        it("should be defined", async () => {
            expect(authController).toBeDefined();
        });

        it("should return new member id with success code", async () => {
            serviceMock.signup.mockResolvedValue(response);

            const result = await authController.signup(signupRequestDto);

            expect(result).not.toBeNull();
            expect(result.data.id).toBe(response.id);
            expect(result.code).toBe(ResponseCode.AUTH_S001);
        });
    });
});