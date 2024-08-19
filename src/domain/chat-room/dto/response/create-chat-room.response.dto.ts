import {
    ApiProperty,
} from "@nestjs/swagger";

export class CreateChatRoomResponseDto {
    @ApiProperty({
        type: String,
        description: "ChatRoom ID",
        example: "1",
    })
    readonly id: string;
}