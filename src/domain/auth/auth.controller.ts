import {
    Body, Controller, Get, Post, Query,
} from "@nestjs/common";
import AuthService from "./auth.service";
import SignupRequestDto from "./dto/req/signup.request.dto";
import CheckPasswordPipe from "./pipe/check-password.pipe";
import SignupResponseDto from "./dto/res/signup.response.dto";
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
import CheckDuplicateNicknameParamsDto from "./dto/req/check-duplicate-nickname.params.dto";
import CheckDuplicateNicknameResponseDto from "./dto/res/check-duplicate-nickname.response.dto";
import {
    ApiCustomResponseDecorator,
} from "../../util/decorators/api-custom-response.decorator";
import CheckDuplicateEmailParamsDto from "./dto/req/check-duplicate-email.params.dto";
import CheckDuplicateEmailResponseDto from "./dto/res/check-duplicate-email.response.dto";
import {
    ResponseStatus,
} from "../../response/response-status";

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
            ResponseStatus.AUTH_S001, data
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
            ResponseStatus.AUTH_S002, result
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
            ResponseStatus.AUTH_S003, result
        );
    }

    /**
     * 중복 정보 확인 api
     * @param params
     */
    @ApiOperation({
        summary: "닉네임 중복 확인 API",
        description: "회원가입 절차중 닉네임은 중복되어서는 안되기 때문에, 사용하고자 하는 닉네임의 중복을 확인한다.",
    })
    @ApiCustomResponseDecorator(CheckDuplicateNicknameResponseDto)
    @Get("/nicknames")
    async checkDuplicateNickname(@Query() params: CheckDuplicateNicknameParamsDto) {
        const result = await this.authService.checkDuplicateNickname(params);

        return new CustomResponse<CheckDuplicateNicknameResponseDto>(
            ResponseStatus.AUTH_S004, result
        );
    }

    @ApiOperation({
        summary: "이메일 중복 확인 API",
        description: "회원가입 절차중 이메일은 중복되어서는 안되기 때문에, 사용하고자 하는 이메일의 중복을 확인한다.",
    })
    @ApiCustomResponseDecorator(CheckDuplicateEmailResponseDto)
    @Get("/emails")
    async checkDuplicateEmail(@Query() params: CheckDuplicateEmailParamsDto) {
        const result = await this.authService.checkDuplicateEmail(params);

        return new CustomResponse<CheckDuplicateEmailResponseDto>(
            ResponseStatus.AUTH_S005, result
        );
    }
}