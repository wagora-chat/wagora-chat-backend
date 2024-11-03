import {
    ApiProperty,
} from "@nestjs/swagger";

export class CreateRoomFileRequestDto {
    @ApiProperty({
        type: "string",
        format: "binary",
        required: false,
    })
    file?: Express.Multer.File;
}