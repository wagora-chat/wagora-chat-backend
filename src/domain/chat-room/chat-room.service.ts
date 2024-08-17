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
import GetChatRoomListResponseDto from "./dto/response/get-chat-room-list.response.dto";

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

    async getChatRoomList(memberId: bigint, name?: string, members?: string[]): Promise<GetChatRoomListResponseDto[]> {
        try {
            const memberRooms = await this.prisma.memberRoom.findMany({
                where: {
                    memberId: memberId,
                },
                select: {
                    roomId: true,
                },
            });

            const roomIds = memberRooms.map((mr) => mr.roomId);

            const chatRooms = await this.prisma.chatRoom.findMany({
                where: {
                    id: {
                        in: roomIds, 
                    },
                    name: name ? {
                        contains: name, 
                    } : undefined,
                    MemberRoom: members ? {
                        some: {
                            memberId: {
                                in: members.map(id => Number(id)),
                            },
                        },
                    } : undefined,
                },
                include: {
                    MemberRoom: true,
                },
            });

            return chatRooms.map(chatRoom => {
                return {
                    id: chatRoom.id.toString(),
                    name: chatRoom.name,
                    color: chatRoom.color,
                    memberCount: chatRoom.MemberRoom.length,
                };
            });
        } catch (error) {
            throw new BadRequestException("Prisma Error", ResponseStatus.CHAT_ROOM_F001);
        }
    }

}
