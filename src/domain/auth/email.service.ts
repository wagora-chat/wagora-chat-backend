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
    SendCodeToEmailRequestDto,
} from "./dto/req/send-code-to-email.request.dto";
import {
    generateRandomNumber,
} from "../../util/random.function";
import {
    VerifyCodeEmailRequestDto,
} from "./dto/req/verify-code-email.request.dto";
import {
    AuthEmailConfirmException,
} from "../../exception/auth-email-confirm.exception";
import {
    ResponseCode,
} from "../../response/response-code.enum";
import {
    SendCodeToEmailResponseDto,
} from "./dto/res/send-code-to-email.response.dto";
import {
    VerifyCodeEmailResponseDto,
} from "./dto/res/verify-code-email.response.dto";

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
    async transferValidateCode(request: SendCodeToEmailRequestDto) {
        const code = generateRandomNumber().toString();

        await this.client.set(request.email, code,);
        const emailOptions: EmailOptions = {
            from: this.configService.get("EMAIL_ACCOUNT") as string,
            to: request.email,
            subject: "Wagora Varification Code",
            html: `<h1> Wagora Email Verification </h1> <p>${code}</p>`,
        };
        await this.transporter.sendMail(emailOptions);

        return new SendCodeToEmailResponseDto(request.email);
    }

    async confirmValidateCode(request: VerifyCodeEmailRequestDto) {
        const resultCode = await this.client.get(request.email);

        if (resultCode === null || resultCode !== request.code) {
            throw new AuthEmailConfirmException("Invalid Email", ResponseCode.AUTH_F003);
        }

        await this.client.del(request.email);

        return new VerifyCodeEmailResponseDto(
            request.email
        );

    }
}