import {
    IsEmail, IsNotEmpty, IsString, IsUrl,
} from "class-validator";
import {
    ApiProperty,
} from "@nestjs/swagger";

export default class SignupRequestDto {
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
        description: "비밀번호",
        required: true,
        example: "test123!@",
    })
    @IsNotEmpty({
        message: "비밀번호는 비어있으면 안됩니다.",
    })
    @IsString({
        message: "비밀번호는 문자열이어야 합니다.",
    })
    readonly password: string;

    @ApiProperty({
        type: String,
        description: "확인 비밀번호",
        required: true,
        example: "test123!@",
    })
    @IsNotEmpty({
        message: "확인 비밀번호는 비어있으면 안됩니다.",
    })
    @IsString({
        message: "확인 비밀번호는 문자열이어야 합니다.",
    })
    readonly checkPassword: string;

    @ApiProperty({
        type: String,
        description: "닉네임",
        required: true,
        example: "테스트_닉네임",
    })
    @IsNotEmpty({
        message: "닉네임은 비어있으면 안됩니다.",
    })
    @IsString({
        message: "닉네임은 문자열이어야 합니다.",
    })
    readonly nickname: string;

    @ApiProperty({
        type: String,
        description: "프로필 사진 경로",
        required: false,
        example: "https://...",
    })
    @IsUrl({}, {
        message: "프로필 사진이 URL 형식과 맞지않습니다.",
    })
    readonly profile: string;
}