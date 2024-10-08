import {
    Body, Controller, Get, HttpCode, HttpStatus, Logger, Patch, Post, Query,
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
import LoginResponseDto from "./dto/res/login.response.dto";
import LoginRequestDto from "./dto/req/login.request.dto";
import {
    SendTempPasswordRequestDto,
} from "./dto/req/send-temp-password.request.dto";
import SendTempPasswordResponseDto from "./dto/res/send-temp-password.response.dto";

@ApiTags("auth")
@Controller("/auth")
export default class AuthController {
    private readonly logger = new Logger(AuthController.name);

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
        this.logger.log("[signup] start");
        const result: SignupResponseDto = await this.authService.signup(body);
        this.logger.log("[signup] finish");

        return new CustomResponse<SignupResponseDto>(
            ResponseStatus.AUTH_S001, result
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
        this.logger.log("[transferValidateCode] start");
        const result = await this.emailService.transferValidateCode(request);
        this.logger.log("[transferValidateCode] finish");

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
        this.logger.log("[confirmValidateCode] start");
        const result = await this.emailService.confirmValidateCode(request);
        this.logger.log("[confirmValidateCode] finish");

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
        this.logger.log("[checkDuplicateNickname] start");
        const result = await this.authService.checkDuplicateNickname(params);
        this.logger.log("[checkDuplicateNickname] finish");

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
        this.logger.log("[checkDuplicateEmail] start");
        const result = await this.authService.checkDuplicateEmail(params);
        this.logger.log("[checkDuplicateEmail] finish");

        return new CustomResponse<CheckDuplicateEmailResponseDto>(
            ResponseStatus.AUTH_S005, result
        );
    }

    @ApiOperation({
        summary: "로그인 API",
        description: "회원은 회원가입한 이메일과 비밀번호를 통해 로그인한다.",
    })
    @HttpCode(HttpStatus.OK)
    @ApiCustomResponseDecorator(LoginResponseDto)
    @Post("/login")
    async login(@Body() request: LoginRequestDto): Promise<CustomResponse<LoginResponseDto>> {
        this.logger.log("[login] start");
        const result: LoginResponseDto = await this.authService.login(request);
        this.logger.log("[login] finish");

        return new CustomResponse<LoginResponseDto>(
            ResponseStatus.AUTH_S006, result
        );
    }

    @ApiOperation({
        summary: "임시 비밀번호 발급 API",
        description: "비밀번호를 재설정하고 싶은 회원은 이메일로 임시 비밀번호를 재발급 받는다.",
    })
    @HttpCode(HttpStatus.OK)
    @ApiCustomResponseDecorator(SendTempPasswordResponseDto)
    @Patch("/passwords")
    async sendTempPassword(@Body() request: SendTempPasswordRequestDto)
        : Promise<CustomResponse<SendTempPasswordResponseDto>> {
        this.logger.log("[sendTempPassword] start");
        const result: SendTempPasswordResponseDto = await this.emailService.sendTempPassword(request);
        this.logger.log("[sendTempPassword] finish");

        return new CustomResponse<SendTempPasswordResponseDto>(
            ResponseStatus.AUTH_S007, result
        );
    }
}
