import {
    ApiProperty,
} from "@nestjs/swagger";

export default class DelegateAdminResponseDto {
    @ApiProperty({
        type: String,
        description: "ChatRoom ID",
        example: "1",
    })
    id: string;

    constructor(id: bigint) {
        this.id = id.toString();
    }
}