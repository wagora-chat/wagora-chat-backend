import {
    Inject,
    Injectable,
} from "@nestjs/common";
import {
    PrismaClient,
} from "@prisma/client";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import FindAllMemberListResponseDto from "./dto/find-all-member-list.response.dto";

@Injectable()
export default class MemberService {

    constructor(@Inject(PrismaConfig) private readonly prisma: PrismaClient) {
    }

    public async findAllMemberList(memberId: bigint): Promise<FindAllMemberListResponseDto[]> {
        const members = await this.prisma.member.findMany({
            where: {
                id: {
                    not: memberId,
                },
            },
            include: {
                profileFile: true,
            },
        });

        return members.map(member => new FindAllMemberListResponseDto(
            member.id.toString(), member.profileFile ? member.profileFile.url : "", member.nickname
        ));

    }

}