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
    private hostAccount: string;
    private validateLimitTime: number;
    private signupLimitTime: number;
    private validateEmailPrefix: string = "validateEmail-";

    constructor(
        @InjectRedis() private readonly client: Redis,
        configService: ConfigService
    ) {
        this.hostAccount = configService.get<string>("EMAIL_ACCOUNT") ?? "";
        this.transporter = nodemailer.createTransport({
            service: configService.get<string>("EMAIL_SERVICE_NAME") ?? "",
            auth: {
                user: this.hostAccount,
                pass: configService.get<string>("EMAIL_PASSWORD") ?? "",
            },
        });
        this.validateLimitTime = configService.get<number>("VALIDATE_LIMIT_TIME") ?? 360;
        this.signupLimitTime = configService.get<number>("SIGNUP_LIMIT_TIME") ?? 86400;
    }

    /**
     * validate code를 요청한 email로 전송
     * @param request
     */
    async transferValidateCode(request: SendCodeToEmailRequestDto): Promise<SendCodeToEmailResponseDto> {
        const code = generateRandomNumber().toString();

        await this.client.set(request.email, code,);
        const emailOptions: EmailOptions = {
            from: this.hostAccount,
            to: request.email,
            subject: "Wagora Varification Code",
            html: `<h1> Wagora 이메일 인증 </h1> <p>code: ${code}</p> </br> <p>제한 시간은 5분입니다.</p>`,
        };
        await this.transporter.sendMail(emailOptions);

        const key = this.validateEmailPrefix + request.email;
        await this.client.set(key, code, "EX", this.validateLimitTime);

        return {
            email: request.email,
        };
    }

    /**
     * validate code 확인을 통한 인증
     * @param request
     */
    async confirmValidateCode(request: VerifyCodeEmailRequestDto): Promise<VerifyCodeEmailResponseDto> {
        const key = this.validateEmailPrefix + request.email;
        const resCode: string | null = await this.client.get(key);

        if (resCode === null || resCode !== request.code) {
            throw new AuthEmailConfirmException(ResponseCode.AUTH_F003);
        }

        await this.client.del(request.email);
        // TODO: @mingi ^^ Redis에서 email 값을 validate로 24시간 유지합니다. 해당 데이터를 꺼내서 validate인지 확인하시면 될 것 같습니다.
        // TODO: 작업 후 해당 anchor 지워주세요.
        await this.client.set(request.email, "validate", "EX", this.signupLimitTime);

        return {
            email: request.email,
        };

    }
}