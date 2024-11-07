import {
    ApiProperty,
} from "@nestjs/swagger";

export default class FindAllMemberListResponseDto {
    @ApiProperty({
        type: String,
        description: "Member ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        type: String,
        description: "Member Profile URL",
        example: "http://memberProfile.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        type: String,
        description: "Member Name",
        example: "Algorithm",
    })
    readonly nickname: string;

    constructor(id: string, profile: string, nickname: string) {
        this.id = id;
        this.profile = profile;
        this.nickname = nickname;
    }
}