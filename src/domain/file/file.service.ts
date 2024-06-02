import {
    Injectable,
} from "@nestjs/common";
import {
    S3Service,
} from "../../s3/s3.service";

@Injectable()
export class FileService {

    constructor(private readonly s3Service: S3Service) {}

    async fileUpload(file: Express.Multer.File): Promise<string> {
        return await this.s3Service.saveProfile(file);

    }

}