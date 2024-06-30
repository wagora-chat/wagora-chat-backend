import {
    Inject, Injectable,
} from "@nestjs/common";
import SignupRequestDto from "./dto/req/signup.request.dto";
import {
    Member, PrismaClient,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import {
    DuplicateEmailException,
} from "../../exception/duplicate-email.exception";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import SignupResponseDto from "./dto/res/signup.response.dto";
import {
    DuplicateNicknameException,
} from "../../exception/duplicate-nickname.exception";
import {
    InjectRedis,
} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import InvalidEmailException from "../../exception/invalid-email.exception";
import CheckDuplicateNicknameParamsDto from "./dto/req/check-duplicate-nickname.params.dto";
import CheckDuplicateNicknameResponseDto from "./dto/res/check-duplicate-nickname.response.dto";
import CheckDuplicateEmailParamsDto from "./dto/req/check-duplicate-email.params.dto";
import CheckDuplicateEmailResponseDto from "./dto/res/check-duplicate-email.response.dto";
import LoginRequestDto from "./dto/req/login.request.dto";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    ConfigService,
} from "@nestjs/config";
import LoginResponseDto from "./dto/res/login.response.dto";
import LoginFailedException from "../../exception/login-failed-exception";
import {
    ResponseStatus,
} from "../../response/response-status";

type ExistsMember = Member | null;

@Injectable()
export default class AuthService {
    private readonly jwtSecret: string;

    constructor(@Inject(PrismaConfig) private readonly prisma: PrismaClient,
                @InjectRedis() private readonly client: Redis,
                configService: ConfigService,
                private readonly jwtService: JwtService) {
        const jwtSecret = configService.get<string>("JWT_SECRET");
        if (!jwtSecret) {
            throw new Error("undefined");
        }
        this.jwtSecret = jwtSecret;
    }

    async signup(signupRequestDto: SignupRequestDto): Promise<SignupResponseDto> {
        const memberByEmail: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: signupRequestDto.email,
            },
        });

        if (memberByEmail) {
            throw new DuplicateEmailException();
        }

        const memberByNickname: ExistsMember = await this.prisma.member.findUnique({
            where: {
                nickname: signupRequestDto.nickname,
            },
        });

        if (memberByNickname) {
            throw new DuplicateNicknameException();
        }

        const validatedEmail: string | null = await this.client.get(signupRequestDto.email);
        if (!validatedEmail) {
            throw new InvalidEmailException();
        }
        await this.client.del(signupRequestDto.email);

        const member: Member = await this.prisma.member.create({
            data: {
                email: signupRequestDto.email,
                password: await bcrypt.hash(signupRequestDto.password, 10),
                nickname: signupRequestDto.nickname,
                profile: signupRequestDto.profile,
            },
        });

        return new SignupResponseDto(member.id.toString());
    }

    async checkDuplicateNickname(
        paramsDto: CheckDuplicateNicknameParamsDto
    ): Promise<CheckDuplicateNicknameResponseDto> {
        const memberByNickname: ExistsMember = await this.prisma.member.findUnique({
            where: {
                nickname: paramsDto.nickname,
            },
        });

        return new CheckDuplicateNicknameResponseDto(!!memberByNickname);
    }

    async checkDuplicateEmail(
        paramsDto: CheckDuplicateEmailParamsDto
    ): Promise<CheckDuplicateEmailResponseDto> {
        const memberByEmail: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: paramsDto.email,
            },
        });

        return new CheckDuplicateEmailResponseDto(!!memberByEmail);
    }

    async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
        const member: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: loginRequestDto.email,
            },
        });

        if (!member || !await bcrypt.compare(loginRequestDto.password, member.password)) {
            throw new LoginFailedException(ResponseStatus.AUTH_FO04);
        }

        const payload = {
            sub: member.id.toString(),
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.jwtSecret,
        });

        return new LoginResponseDto(
            member.nickname, accessToken, "Bearer"
        );
    }
}