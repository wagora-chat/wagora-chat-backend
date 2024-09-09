import {
    ApiProperty,
} from "@nestjs/swagger";

export class LeaveChatRoomResponseDto {
    @ApiProperty({
        type: String,
        description: "Leave Message",
        example: "채팅방에서 나갔습니다.",
    })
    readonly message: string;

}
