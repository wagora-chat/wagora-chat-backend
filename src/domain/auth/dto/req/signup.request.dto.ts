import {
    IsEmail, IsNotEmpty, IsString, IsUrl, Matches,
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
        minLength: 2,
        maxLength: 10,
        example: "테스트_닉네임",
    })
    @IsNotEmpty({
        message: "닉네임은 비어있으면 안됩니다.",
    })
    @IsString({
        message: "닉네임은 문자열이어야 합니다.",
    })
    @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/, {
        message: "닉네임 형식을 지켜주세요.",
    })
    readonly nickname: string;

    @ApiProperty({
        type: BigInt,
        description: "프로필 사진 Id",
        required: false,
        example: "1",
    })
    readonly profile: bigint;
}