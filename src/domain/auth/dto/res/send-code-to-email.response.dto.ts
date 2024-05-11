import {
    IsEmail, IsNotEmpty, IsString,
} from "class-validator";

export class SendCodeToEmailResponseDto {
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

}
