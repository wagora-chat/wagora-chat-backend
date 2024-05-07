import {
    Body, Controller, Post,
} from "@nestjs/common";
import AuthService from "./auth.service";
import SignupRequestDto from "./dto/req/signup.request.dto";
import CheckPasswordPipe from "./pipe/check-password.pipe";
import SignupResponseDto from "./dto/res/signup.response.dto";
import {
    ResponseCode,
} from "../../response/response-code.enum";
import ResponseData from "../../response/response-data";

@Controller("/auth")
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/signup")
    async signup(
        @Body(CheckPasswordPipe) body: SignupRequestDto
    ): Promise<ResponseData<SignupResponseDto>> {
        const data: SignupResponseDto = await this.authService.signup(body);

        return new ResponseData<SignupResponseDto>(
            ResponseCode.AUTH_S001, data
        );
    }

}