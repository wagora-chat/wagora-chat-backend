import {
    ApiProperty,
} from "@nestjs/swagger";

export class InviteChatRoomResponseDto {
    @ApiProperty({
        description: "초대 성공 메시지",
        example: "3명의 회원이 채팅방에 초대되었습니다.",
    })
    readonly message: string;

    constructor(message: string) {
        this.message = message;
    }
}