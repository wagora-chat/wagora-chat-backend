import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsArray, IsString,
} from "class-validator";

export class InviteChatRoomRequestDto {
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
    @IsArray()
    @IsString({
        each: true,
    })
    readonly ids: string[];
}