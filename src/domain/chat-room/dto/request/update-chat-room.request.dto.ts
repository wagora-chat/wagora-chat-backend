import {
    ApiProperty,
} from "@nestjs/swagger";

export class UpdateChatRoomRequestDto {
    @ApiProperty({
        type: String,
        description: "name",
        required: true,
        example: "알고리즘 심화 (수정)",
    })
    readonly name: string;
    @ApiProperty({
        type: String,
        description: "color (수정)",
        required: true,
        example: "#FFFFFF",
    })
    readonly color: string;
}
