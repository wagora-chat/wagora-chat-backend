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
import {
    LeaveChatRoomResponseDto,
} from "./dto/response/leave-chat-room.response.dto";
import {
    ChatRoomNotFoundException,
} from "../../exception/chat-room-not-found.exception";
import {
    MemberNotFoundException,
} from "../../exception/member-not-found.exception";
import {
    LeaveChatRoomFailException,
} from "../../exception/leave-chat-room-fail.exception";
import {
    InviteChatRoomResponseDto,
} from "./dto/response/invite-chat-room.response.dto";
import MemberNotExistException from "../../exception/member-not-exist.exception";
import {
    MemberAlreadyJoinedException,
} from "../../exception/member-already-joined.exception";
import {
    NoPermissionInviteException,
} from "../../exception/no-permission-invite.exception";

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

    async leaveChatRoom(chatRoomId: bigint, member: Member): Promise<LeaveChatRoomResponseDto> {
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: {
                id: chatRoomId,
            },
            include: {
                MemberRoom: true,
            },
        });
        if (!chatRoom) {
            throw new ChatRoomNotFoundException(ResponseStatus.CHAT_ROOM_F003);
        }
        // 1. chatRoom에 소속된 member인지 확인
        const includeCurrentMember = chatRoom.MemberRoom.some(value => value.memberId === member.id);
        if (!includeCurrentMember) {
            throw new MemberNotFoundException(ResponseStatus.CHAT_ROOM_F004);
        }

        // 2-1. 채팅방 관리자가 아닌 경우, 채팅방 나가기
        if (chatRoom.managerId !== member.id) {
            await this.prisma.memberRoom.delete({
                where: {
                    roomId_memberId: {
                        roomId: chatRoomId,
                        memberId: member.id,
                    },
                },
            });

            return {
                message: "채팅방을 나갔습니다.",
            };
        } else if (chatRoom.MemberRoom.length === 1) {
            // 2-2. 채팅방 관리자 and 본인만 있는 경우, 성공과 채팅방도 삭제
            await this.prisma.memberRoom.delete({
                where: {
                    roomId_memberId: {
                        roomId: chatRoomId,
                        memberId: member.id,
                    },
                },
            });
            await this.prisma.chatRoom.delete({
                where: {
                    id: chatRoom.id,
                },
            });

            return {
                "message": "마지막으로 채팅방을 나가, 채팅방이 삭제되었습니다.",
            };
        } else {
            // 2-3. 채팅방 관리자 and 다른 사람들도 있는 경우, 관리자를 넘겨줘야 나갈 수 있다는 예외 발생
            throw new LeaveChatRoomFailException(ResponseStatus.CHAT_ROOM_F005);
        }
    }

    async inviteChatRoom(
        chatRoomId: bigint,
        ids: string[],
        inviterId: bigint,
    ): Promise<InviteChatRoomResponseDto> {
        // 1. 채팅방 존재 여부 확인
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: {
                id: chatRoomId,
            },
            include: {
                MemberRoom: true,
            },
        });

        if (!chatRoom) {
            throw new ChatRoomNotFoundException(ResponseStatus.CHAT_ROOM_F003);
        }

        // 2. 초대자가 채팅방의 멤버인지 확인
        const isInviterMember = chatRoom.MemberRoom.some(mr => mr.memberId === inviterId);
        if (!isInviterMember) {
            throw new NoPermissionInviteException(ResponseStatus.CHAT_ROOM_F007);
        }

        // 3. 초대할 멤버 조회
        const members = await this.prisma.member.findMany({
            where: {
                id: {
                    in: ids.map(id => BigInt(id)),
                },
            },
        });

        if(members.length !== ids.length) {
            throw new MemberNotExistException(ResponseStatus.CHAT_ROOM_F006);
        }

        // 4. 이미 참여 중인 멤버를 필터링
        const existingMembers = chatRoom.MemberRoom.map(mr => mr.memberId);
        const addMemberIds = members.filter(member => !existingMembers.includes(member.id));

        if(addMemberIds.length !== members.length) {
            throw new MemberAlreadyJoinedException(ResponseStatus.CHAT_ROOM_F006);
        }

        await this.prisma.memberRoom.createMany({
            data: addMemberIds.map(member => ({
                roomId: chatRoomId,
                memberId: member.id,
            })),
        });

        return new InviteChatRoomResponseDto(`${addMemberIds.length}명의 회원이 채팅방에 초대되었습니다.`);
    }
}
