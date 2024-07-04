import {
    ApiProperty,
} from "@nestjs/swagger";

export class CreateChatRoomRequestDto {
    @ApiProperty({
        type: String,
        description: "name",
        required: true,
        example: "알고리즘 심화",
    })
    readonly name: string;
    @ApiProperty({
        type: String,
        description: "color",
        required: true,
        example: "#FFFFFF",
    })
    readonly color: string;
    @ApiProperty({
        description: "참여할 멤버 ID 배열",
        example: [
            "3",
            "2",
            "4",
            "6",
        ],
        isArray: true,
        type: String,
    })
    readonly ids: string[];
}
