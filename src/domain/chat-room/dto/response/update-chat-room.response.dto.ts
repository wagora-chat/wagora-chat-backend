import {
    ApiProperty,
} from "@nestjs/swagger";

export class UpdateChatRoomResponseDto {
    @ApiProperty({
        type: String,
        description: "Updated ChatRoom ID",
        example: "1",
    })
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}
