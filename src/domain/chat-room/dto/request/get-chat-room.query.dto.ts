import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsOptional, IsString,
} from "class-validator";
import {
    Transform,
} from "class-transformer";

export default class GetChatRoomQueryDto {
    @ApiProperty({
        type: String,
        description: "Words included in ChatRoom title",
        required: false,
        example: "Algorithm",
    })
    @IsOptional()
    @IsString()
    readonly name?: string;

    @ApiProperty({
        type: Array<string>,
        description: "ID Array of Members",
        required: false,
        example: "1, 3, 6, 2",
    })
    @Transform(({
        value,
    }) => value.split(","))
    @IsOptional()
    readonly members: string[];
}