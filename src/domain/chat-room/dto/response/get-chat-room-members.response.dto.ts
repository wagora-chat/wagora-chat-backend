import {
    ApiProperty,
} from "@nestjs/swagger";

export default class GetChatRoomMembersResponseDto {
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

    @ApiProperty({
        type: Boolean,
        description: "Manager 여부",
        example: "true",
    })
    readonly isManager: boolean;

    constructor(id: string, nickname: string, profileUrl: string | null, isManager: boolean) {
        this.id = id;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.isManager = isManager;
    }
}