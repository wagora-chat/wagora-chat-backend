import {
    ApiProperty,
} from "@nestjs/swagger";

export default class GetNonMembersInChatRoomResponseDto {
    @ApiProperty({
        type: String,
        description: "ChatRoom ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        type: String,
        description: "Nickname",
        example: "난이춘식",
    })
    readonly nickname: string;

    @ApiProperty({
        type: String,
        description: "Member Profile URL",
        example: "http://memberProfile.com/profile.jpg",
    })
    readonly profileUrl: string | null;

    constructor(id: string, nickname: string, profileUrl: string | null) {
        this.id = id;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
    }
}