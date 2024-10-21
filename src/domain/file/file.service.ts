import {
    Injectable,
} from "@nestjs/common";
import {
    S3Service,
} from "../../s3/s3.service";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import {
    File,
} from "@prisma/client";

@Injectable()
export class FileService {

    constructor(
        private readonly s3Service: S3Service,
        private readonly prismaService: PrismaConfig
    ) {
    }

    async fileUpload(file: Express.Multer.File): Promise<bigint> {
        const savedFilePath = await this.s3Service.saveProfile(file);

        const savedFile: File = await this.prismaService.file.create({
            data: {
                name: file.filename,
                url: savedFilePath,
                size: BigInt(file.size),
                mime: file.mimetype,
            },
        });

        return savedFile.id;
    }

}