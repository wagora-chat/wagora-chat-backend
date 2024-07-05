import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsEmail, IsNotEmpty, IsString, Matches,
} from "class-validator";

export default class LoginRequestDto {
    @ApiProperty({
        type: String,
        description: "이메일",
        required: true,
        example: "test123@naver.com",
    })
    @IsEmail({}, {
        message: "이메일은 비어있으면 안되며, 문자열 형식과 맞아야 합니다.",
    })
    readonly email: string;

    @ApiProperty({
        type: String,
        description: "비밀번호",
        required: true,
        minLength: 8,
        maxLength: 20,
        example: "test123!@",
    })
    @IsNotEmpty({
        message: "비밀번호는 비어있으면 안됩니다.",
    })
    @IsString({
        message: "비밀번호는 문자열이어야 합니다.",
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#~$*])[A-Za-z\d!@#~$*]{8,20}$/, {
        message: "비밀번호 형식을 지켜주세요.",
    })
    readonly password: string;
}