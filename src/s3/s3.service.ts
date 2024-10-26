import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client, S3ServiceException,
} from "@aws-sdk/client-s3";
import {
    ConfigService,
} from "@nestjs/config";
import {
    Injectable,
} from "@nestjs/common";
import {
    uuidFunction,
} from "../util/func/uuid.function";
import {
    File,
} from "@prisma/client";

@Injectable()
export class S3Service {
    readonly s3Client: S3Client;

    constructor(readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get("AWS_REGION") ?? "ap-northeast-2",
            credentials: {
                accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY") ?? "",
                secretAccessKey: this.configService.get("AWS_SECRET_KEY") ?? "",
            },
        });
    }

    public async saveProfile(file: Express.Multer.File) {
        const strings = file.originalname.split(".");
        const ext = strings[strings.length - 1];
        const fileId = uuidFunction.v4();
        const fileKey = `${this.configService.get("AWS_BUCKET_KEY_ENV")}/profile/${fileId}`;
        const filePath = `https://s3.${this.configService.get("AWS_REGION")}.amazonaws.com/${this.configService.get("AWS_BUCKET_NAME")}/${fileKey}`;

        const command = new PutObjectCommand({
            Bucket: this.configService.get("AWS_BUCKET_NAME"), // S3 버킷 이름
            Key: fileKey, // 업로드될 파일의 이름
            Body: file.buffer, // 업로드할 파일
            ACL: "public-read", // 파일 접근 권한
            ContentType: `image/${ext}`, // 파일 타입
        });
        await this.s3Client.send(command);

        return filePath;
    }

    public async deleteProfileFile(file: File) {
        try {
            const fileId = file.url.split("/")[-1];
            const input = {
                Bucket: this.configService.get("AWS_BUCKET_NAME"),
                Key: fileId,
            };
            const command = new DeleteObjectCommand(input);
            await this.s3Client.send(command);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }

    }
}