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
import Response from "../../response/response";

@Controller("/auth")
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/signup")
    async signup(
        @Body(CheckPasswordPipe) body: SignupRequestDto
    ): Promise<Response<SignupResponseDto>> {
        const data: SignupResponseDto = await this.authService.signup(body);

        return new Response<SignupResponseDto>(
            ResponseCode.AUTH_S001, data
        );
    }

}