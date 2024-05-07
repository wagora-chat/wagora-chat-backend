import * as nodemailer from "nodemailer";
import {
    Injectable,
} from "@nestjs/common";
import {
    ConfigService,
} from "@nestjs/config";
import Redis from "ioredis";
import {
    InjectRedis,
} from "@liaoliaots/nestjs-redis";
import {
    SendCodeToEmailRequest,
} from "../controller/dto/req/send-code-to-email.request";
import {
    generateRandomNumber,
} from "../../../util/random.function";
import {
    SendCodeToEmailResponseData,
} from "../controller/dto/res/send-code-to-email.response";
import {
    VerifyCodeEmailRequest,
} from "../controller/dto/req/verify-code-email-request";
import {
    AuthEmailConfirmException,
} from "../../../exception/auth-email-confirm.exception";
import {
    ResponseCode,
} from "../../../exception/error-code.enum";
import {
    VerifyCodeEmailResponseData,
} from "../controller/dto/res/verify-code-email.response";

interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class EmailService {
    private transporter;

    constructor(private readonly configService: ConfigService, @InjectRedis() private readonly client: Redis) {
        this.transporter = nodemailer.createTransport({
            service: this.configService.get("EMAIL_SERVICE_NAME"),
            auth: {
                user: this.configService.get("EMAIL_ACCOUNT"),
                pass: this.configService.get("EMAIL_PASSWORD"),
            },
        });
        
    }

    /**
     * validate code를 요청한 email로 전송
     * @param request
     */
    async transferValidateCode(request: SendCodeToEmailRequest) {
        // HACK: 비동기 동작 건의
        const code = generateRandomNumber().toString();
        // 1-email에 해당하는 code를 radis로 저장
        await this.client.set(request.email, code);

        // 2-email에 해당하는 code를 email로 전송
        const emailOptions: EmailOptions = {
            from: this.configService.get("EMAIL_ACCOUNT") as string,
            to: request.email,
            subject: "Wagora Varification Code",
            html: `<h1> Wagora Email Verification </h1> <p>${code}</p>`,
        };
        await this.transporter.sendMail(emailOptions);

        return new SendCodeToEmailResponseData(request.email);
    }

    async confirmValidateCode(request: VerifyCodeEmailRequest) {
        const resultCode = await this.client.get(request.email);

        if (resultCode === null || resultCode !== request.code) {
            throw new AuthEmailConfirmException("Invalid Email", ResponseCode.AUTH_F003);
        }

        await this.client.del(request.email);

        return new VerifyCodeEmailResponseData(
            request.email
        );

    }
}