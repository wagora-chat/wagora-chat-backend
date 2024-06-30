import {
    ApiProperty,
} from "@nestjs/swagger";

export default class LoginResponseDto {
    @ApiProperty({
        type: String,
        description: "닉네임",
        example: "test123",
    })
    readonly nickname: string;

    @ApiProperty({
        type: String,
        description: "액세스 토큰",
    })
    readonly accessToken: string;

    @ApiProperty({
        type: String,
        description: "토큰 타입",
    })
    readonly tokenType: string;

    constructor(nickname: string, accessToken: string, tokenType: string) {
        this.nickname = nickname;
        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }
}