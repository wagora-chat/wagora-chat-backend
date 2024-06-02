import {
    Module,
} from "@nestjs/common";
import {
    FileService,
} from "./file.service";
import {
    FileController,
} from "./file.controller";
import {
    S3Module,
} from "../../s3/s3.module";

@Module({
    imports: [S3Module,],
    controllers: [FileController,],
    providers: [FileService,],
    exports: [],
})
export class FileModule {
}