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

type ExistsMember = Member | null;

@Injectable()
export default class AuthService {
    constructor(@Inject(PrismaConfig) private readonly prisma: PrismaClient) {
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

}