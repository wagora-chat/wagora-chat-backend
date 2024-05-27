import {
    IsEmail, IsNotEmpty, IsString, Length,
} from "class-validator";
import {
    ApiProperty,
} from "@nestjs/swagger";

export class VerifyCodeEmailRequestDto {
    @ApiProperty({
        type: String,
        description: "이메일",
        required: true,
        example: "test123@naver.com",
    })
    @IsNotEmpty({
        message: "이메일은 비어있으면 안됩니다.",
    })
    @IsString({
        message: "이메일은 문자열이어야 합니다.",
    })
    @IsEmail({}, {
        message: "이메일 형식과 맞지 않습니다.",
    })
    readonly email: string;

    @ApiProperty({
        type: String,
        description: "인증 코드",
        required: true,
        example: "102741",
    })
    @IsNotEmpty({
        message: "인증번호는 비어있으면 안됩니다.",
    })
    // HACK: 우선 적용, Frontend와 논의 필요
    @Length(6, 6, {
        message: "인증번호는 6자리여야 합니다.",
    })
    readonly code: string;
}