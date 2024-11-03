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

    async profileUpload(file: Express.Multer.File): Promise<bigint> {
        const {
            filePath, fileKey,
        } = await this.s3Service.saveProfile(file);

        const savedFile: File = await this.prismaService.file.create({
            data: {
                name: file.originalname,
                url: filePath,
                fileKey: fileKey,
                size: BigInt(file.size),
                mime: file.mimetype,
            },
        });

        return savedFile.id;
    }

    async roomFileUpload(roomId: bigint, file: Express.Multer.File): Promise<bigint> {
        const {
            filePath, fileKey,
        }  = await this.s3Service.saveRoomFile(roomId, file);

        const savedFile: File = await this.prismaService.file.create({
            data: {
                name: file.originalname,
                url: filePath,
                fileKey: fileKey,
                size: BigInt(file.size),
                mime: file.mimetype,
            },
        });

        return savedFile.id;
    }

    async fileDelete(fileId: bigint): Promise<boolean> {
        console.log("fileId", fileId);

        const file = await this.prismaService.file.findUnique({
            where: {
                id: fileId, 
            },
        });
        if (!file) {
            return false;
        }
        // S3에 올라간 File 삭제
        await this.s3Service.deleteFile(file);

        await this.prismaService.file.delete({
            where: {
                id: fileId,
            },
        });

        return true;
    }

}