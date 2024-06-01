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
import {
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    ApiCustomResponseDecorator,
} from "../../util/decorators/api-custom-response.decorator";

@ApiTags("auth")
@Controller("/auth")
export default class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService
    ) {
    }

    /**
     * 회원가입 API
     * @param body
     */
    @ApiOperation({
        summary: "회원 가입 API",
        description: "인증된 이메일로 1시간 이내로, 회원가입을 한다.",
    })
    @ApiCustomResponseDecorator(SignupResponseDto)
    @Post("/signup")
    async signup(
        @Body(CheckPasswordPipe) body: SignupRequestDto
    ): Promise<CustomResponse<SignupResponseDto>> {
        const data: SignupResponseDto = await this.authService.signup(body);

        return new CustomResponse<SignupResponseDto>(
            ResponseCode.AUTH_S001, data
        );
    }

    /**
     * email 인증 요청 api
     * @param request
     */
    @ApiOperation({
        summary: "이메일 인증 요청 API",
        description: "자신의 이메일로 인증번호를 받는다.",
    })
    @ApiCustomResponseDecorator(SendCodeToEmailResponseDto)
    @Post("/emails")
    async transferValidateCode(@Body() request: SendCodeToEmailRequestDto)
        : Promise<CustomResponse<SendCodeToEmailResponseDto>> {
        const result = await this.emailService.transferValidateCode(request);

        return new CustomResponse<SendCodeToEmailResponseDto>(
            ResponseCode.AUTH_S002, result
        );
    }

    /**
     * email 인증 확인 api
     * @param request
     */
    @ApiOperation({
        summary: "이메일 인증 확인 API",
        description: "받은 인증번호를 5분 이내로 입력해서, 본인 이메일임을 인증한다.",
    })
    @ApiCustomResponseDecorator(VerifyCodeEmailResponseDto)
    @Post("/emails/confirm")
    async confirmValidateCode(@Body() request: VerifyCodeEmailRequestDto)
    : Promise<CustomResponse<VerifyCodeEmailResponseDto>> {
        const result = await this.emailService.confirmValidateCode(request);

        return new CustomResponse<VerifyCodeEmailResponseDto>(
            ResponseCode.AUTH_S003, result
        );
    }

}