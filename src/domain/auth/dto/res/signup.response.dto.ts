import {
    ApiProperty,
} from "@nestjs/swagger";

export default class SignupResponseDto {
    @ApiProperty({
        type: String,
        description: "Member id",
        required: true,
        example: "1",
    })
    readonly id: string;
    constructor(id: string) {
        this.id = id;
    }
}