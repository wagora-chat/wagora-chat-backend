import {
    Module,
} from "@nestjs/common";
import {
    PrismaConfig,
} from "./prisma.config";

@Module({
    providers: [PrismaConfig,],
    exports: [PrismaConfig,],
})
export default class PrismaModule {}