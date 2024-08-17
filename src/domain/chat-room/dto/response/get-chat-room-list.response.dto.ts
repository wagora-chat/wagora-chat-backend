import {
    ApiProperty,
} from "@nestjs/swagger";

export default class GetChatRoomListResponseDto {
    @ApiProperty({
        type: String,
        description: "ChatRoom ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        type: String,
        description: "ChatRoom Name",
        example: "Algorithm",
    })
    name: string;

    @ApiProperty({
        type: String,
        description: "ChatRoom Banner Color",
        example: "#FFFFFF",
    })
    color: string;

    @ApiProperty({
        type: Number,
        description: "ChatRoom Member Count",
        example: "21",
    })
    memberCount: number;
}