import {
    ApiProperty,
} from "@nestjs/swagger";

export class VerifyCodeEmailResponseDto {
    @ApiProperty({
        type: String,
        description: "이메일",
        required: true,
        example: "test123@naver.com",
    })
    readonly email: string;
}
