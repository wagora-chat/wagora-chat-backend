import {
    FileService,
} from "./file.service";
import {
    Controller, HttpCode, HttpStatus,
    Post, UploadedFile, UseInterceptors,
} from "@nestjs/common";
import CustomResponse from "../../response/custom-response";
import {
    FileUploadResponseDto,
} from "./dto/response/file-upload.response.dto";
import {
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    ApiCustomResponseDecorator,
} from "../../util/decorators/api-custom-response.decorator";
import {
    FileInterceptor,
} from "@nestjs/platform-express";
import {
    FileUploadSwaggerDecorator,
} from "../../util/decorators/dto-swagger.decorator";
import {
    ResponseStatus,
} from "../../response/response-status";

@ApiTags("files")
@Controller("files")
export class FileController {
    constructor(private readonly fileService: FileService) {
    }

    @ApiOperation({
        summary: "파일 업로드",
        description: "파일읍 업로드 하고 저장된 경로를 반환받는다.",
    })
    @ApiCustomResponseDecorator(FileUploadResponseDto)
    @UseInterceptors(FileInterceptor("file"))
    @FileUploadSwaggerDecorator()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async fileUpload(@UploadedFile() file: Express.Multer.File): Promise<CustomResponse<FileUploadResponseDto>> {
        const result = await this.fileService.fileUpload(file);
        
        return new CustomResponse(ResponseStatus.FILE_S001, {
            filePath: result,
        });
    }

}