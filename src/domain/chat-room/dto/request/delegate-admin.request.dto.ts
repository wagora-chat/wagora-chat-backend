import {
    IsNumber,
} from "class-validator";
import {
    ApiProperty,
} from "@nestjs/swagger";

export default class DelegateAdminRequestDto {
    @ApiProperty({
        type: Number,
        description: "Delegate Admin ID",
        required: true,
        example: "1",
    })
    @IsNumber()
    id: number;
}