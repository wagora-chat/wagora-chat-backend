import * as nodemailer from "nodemailer";
import {
    PrismaClient,
} from "@prisma/client";
import {
    Inject,
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
    SendCodeToEmailResponseDto,
} from "./dto/res/send-code-to-email.response.dto";
import {
    VerifyCodeEmailResponseDto,
} from "./dto/res/verify-code-email.response.dto";
import {
    ResponseStatus,
} from "../../response/response-status";
import {
    SendTempPasswordRequestDto,
} from "./dto/req/send-temp-password.request.dto";
import {
    generateRandomPasswordFunction,
} from "../../util/func/random-password.function";
import SendTempPasswordResponseDto from "./dto/res/send-temp-password.response.dto";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import InvalidEmailException from "../../exception/invalid-email.exception";
import {
    hashPassword,
} from "../../util/func/hash-password.function";
import {
    getEmailTemplate,
} from "../../util/func/email-templates.func";
import MemberNotExistException from "../../exception/member-not-exist.exception";

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
    private tempPasswordPrefix: string = "tempPassword-";

    constructor(
        @InjectRedis() private readonly client: Redis,
        @Inject(PrismaConfig) private readonly prisma: PrismaClient,
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
            subject: "Wagora Verification Code",
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
            throw new AuthEmailConfirmException(ResponseStatus.AUTH_F003);
        }

        await this.client.del(request.email);
        await this.client.set(request.email, "validate", "EX", this.signupLimitTime);

        return {
            email: request.email,
        };

    }

    /**
     * 임시 비밀번호 전송
     * @param email
     * @param code
     */
    async sendTempPassword(request: SendTempPasswordRequestDto): Promise<SendTempPasswordResponseDto> {
        const validatedEmail: string | null = await this.client.get(request.email);
        if (!validatedEmail) {
            throw new InvalidEmailException(ResponseStatus.AUTH_F008);
        }
        await this.client.del(request.email);

        const member = await this.prisma.member.findUnique({
            where: {
                email: request.email,
            },
        });
        if (!member) {
            throw new MemberNotExistException();
        }

        const tempPassword = generateRandomPasswordFunction();
        const hashedPassword = await hashPassword(tempPassword);

        await this.prisma.member.update({
            where: {
                email: request.email,
            },
            data: {
                password: hashedPassword,
            },
        });

        const emailOptions: EmailOptions = {
            from: this.hostAccount,
            to: request.email,
            subject: "Wagora Temporary Password",
            html: getEmailTemplate(tempPassword),
        };

        await this.transporter.sendMail(emailOptions);

        return new SendTempPasswordResponseDto(member.id.toString());
    }

    /**
     * 이메일로 멤버 ID 조회
     * @param email
     */
    async getMemberIdByEmail(email: string): Promise<string> {
        const member = await this.prisma.member.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
            },
        });

        if (!member) {
            throw new InvalidEmailException(ResponseStatus.AUTH_F003);
        }

        return member.id.toString();
    }
}