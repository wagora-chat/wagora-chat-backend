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
import CustomResponse from "../../response/custom-response";
import {
    SendCodeToEmailRequestDto,
} from "./dto/req/send-code-to-email.request.dto";
import {
    SendCodeToEmailResponseDto,
} from "./dto/res/send-code-to-email.response.dto";
import {
    VerifyCodeEmailRequestDto,
} from "./dto/req/verify-code-email.request.dto";
import {
    VerifyCodeEmailResponseDto,
} from "./dto/res/verify-code-email.response.dto";
import {
    EmailService,
} from "./email.service";

@Controller("/auth")
export default class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService
    ) {
    }

    @Post("/signup")
    async signup(
        @Body(CheckPasswordPipe) body: SignupRequestDto
    ): Promise<CustomResponse<SignupResponseDto>> {
        const data: SignupResponseDto = await this.authService.signup(body);

        return new CustomResponse<SignupResponseDto>(
            ResponseCode.AUTH_S001, data
        );
    }

    @Post("/emails")
    async transferValidateCode(@Body() request: SendCodeToEmailRequestDto)
        : Promise<CustomResponse<SendCodeToEmailResponseDto>> {
        const result = await this.emailService.transferValidateCode(request);

        return new CustomResponse<SendCodeToEmailResponseDto>(
            ResponseCode.AUTH_S002, result
        );
    }

    @Post("/emails/confirm")
    async confirmValidateCode(@Body() request: VerifyCodeEmailRequestDto)
    : Promise<CustomResponse<VerifyCodeEmailResponseDto>> {
        const result = await this.emailService.confirmValidateCode(request);

        return new CustomResponse<VerifyCodeEmailResponseDto>(
            ResponseCode.AUTH_S003, result
        );
    }

}