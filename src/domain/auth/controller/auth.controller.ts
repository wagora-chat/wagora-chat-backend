import {
    Body, Controller, Get, Param, Post,
} from "@nestjs/common";
import {
    EmailService,
} from "../service/email.service";
import {
    SendCodeToEmailRequest,
} from "./dto/req/send-code-to-email.request";
import {
    SendCodeToEmailResponse,
} from "./dto/res/send-code-to-email.response";
import {
    ResponseCode,
} from "../../../exception/error-code.enum";
import {
    VerifyCodeEmailRequest,
} from "./dto/req/verify-code-email-request";
import {
    VerifyCodeEmailResponse,
} from "./dto/res/verify-code-email.response";

@Controller("/auth")
export class AuthController {
    constructor(private readonly emailService: EmailService) {
    }

    @Post("/emails")
    async transferValidateCode(@Body() request: SendCodeToEmailRequest) {
        const result = await this.emailService.transferValidateCode(request);

        return new SendCodeToEmailResponse(
            ResponseCode.AUTH_S002, result, new Date()
        );
    }

    @Post("/emails/confirm")
    async confirmValidateCode(@Body() request: VerifyCodeEmailRequest) {
        const result = await this.emailService.confirmValidateCode(request);

        return new VerifyCodeEmailResponse(
            ResponseCode.AUTH_S003, result, new Date()
        );
    }

}