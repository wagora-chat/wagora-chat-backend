import {
    IsEmail, IsNotEmpty, IsString, IsUrl,
} from "class-validator";

export default class SignupRequestDto {
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

    @IsNotEmpty({
        message: "비밀번호는 비어있으면 안됩니다.",
    })
    @IsString({
        message: "비밀번호는 문자열이어야 합니다.",
    })
    readonly password: string;

    @IsNotEmpty({
        message: "확인 비밀번호는 비어있으면 안됩니다.",
    })
    @IsString({
        message: "확인 비밀번호는 문자열이어야 합니다.",
    })
    readonly checkPassword: string;

    @IsNotEmpty({
        message: "닉네임은 비어있으면 안됩니다.",
    })
    @IsString({
        message: "닉네임은 문자열이어야 합니다.",
    })
    readonly nickname: string;

    @IsUrl({}, {
        message: "프로필 사진이 URL 형식과 맞지않습니다.",
    })
    readonly profile: string;
}