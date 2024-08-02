import {
    Inject,
    Injectable,
} from "@nestjs/common";
import {
    CreateChatRoomRequestDto,
} from "./dto/request/create-chat-room.request.dto";
import {
    Member,
    PrismaClient,
    Prisma,
} from "@prisma/client";
import {
    CreateChatRoomResponseDto,
} from "./dto/response/create-chat-room.response.dto";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import {
    BadRequestException,
} from "../../exception/http/bad-request.exception";
import {
    ResponseStatus,
} from "../../response/response-status";

type ChatRoom = {
    id: bigint | string,
    name: string,
    color: string,
    memberCount: bigint
}

@Injectable()
export class ChatRoomService {
    constructor(
        @Inject(PrismaConfig) private readonly prisma: PrismaClient
    ) {
    }

    async createChatRoom(createChatRoomDto: CreateChatRoomRequestDto, member: Member)
        : Promise<CreateChatRoomResponseDto> {
        try {
            const chatRoom = await this.prisma.chatRoom.create({
                data: {
                    name: createChatRoomDto.name,
                    color: createChatRoomDto.color,
                    managerId: member.id,
                    MemberRoom: {
                        create: [
                            {
                                memberId: member.id,
                            },
                            ...createChatRoomDto.ids.map((id) => ({
                                memberId: BigInt(id),
                            })),
                        ],
                    },
                },
                include: {
                    MemberRoom: true,
                },
            });

            return {
                id: chatRoom.id.toString(),
            };
        } catch (error) {
            // FIXME: Prisma Exception을 잡을 수 없는 문제가 있음 HttpExceptionFilter 확장 필요
            throw new BadRequestException("Prisma Error", ResponseStatus.CHAT_ROOM_F001);
        }
    }

    async getChatRoomList(memberId: bigint, name?: string, members?: string) {
        try {

            let whereClause: string =
                `where m.room_id in (select room_id from member_room where member_id = ${memberId})`;

            if (name) {
                whereClause += ` and name LIKE '%${name}%'`;
            } else if (members && members.length > 0) {
                const memberIds: string = members!
                    .split(",")
                    .map(id => Number(id))
                    .join(", ");

                whereClause += ` and m.room_id in (select room_id from member_room where room_id in (${memberIds}))`;
            }

            const query = `
            select c.id as id,
                   c.name as name,
                   c.color as color,
                   count(m.*) as "memberCount"
            from chat_room c join member_room m on c.id = m.room_id
            ${whereClause}
            group by c.id
            `;

            const chatRooms: ChatRoom[] = await this.prisma.$queryRawUnsafe(query);

            return chatRooms.map(chatRoom => {
                return {
                    id: chatRoom.id.toString(),
                    name: chatRoom.name,
                    color: chatRoom.color,
                    memberCount: chatRoom.memberCount.toString(),
                };
            });
        } catch (error) {
            throw new BadRequestException("Prisma Error", ResponseStatus.CHAT_ROOM_F001);
        }
    }

}
