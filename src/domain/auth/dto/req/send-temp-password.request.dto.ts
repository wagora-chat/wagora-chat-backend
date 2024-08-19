import {
    IsEmail,
} from "class-validator";
import {
    ApiProperty,
} from "@nestjs/swagger";

export class SendTempPasswordRequestDto {

    @ApiProperty({
        type: String,
        description: "이메일",
        required: true,
        example: "test123@naver.com",
    })
    @IsEmail({}, {
        message: "이메일 주소 형식을 지켜주세요.",
    })
    readonly email: string;
}