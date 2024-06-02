import {
    ApiProperty,
} from "@nestjs/swagger";

export class FileUploadResponseDto {
    @ApiProperty({
        name: "filePath",
        description: "file 이 실제로 저장되는 s3 경로",
    })
    readonly filePath: string;
}