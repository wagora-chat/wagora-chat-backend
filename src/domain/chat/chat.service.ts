import {
    Inject, Injectable,
} from "@nestjs/common";
import {
    PrismaConfig,
} from "../../prisma/prisma.config";
import {
    PrismaClient,
} from "@prisma/client";
import SendChatMessage from "./dto/send-chat.message";
import MemberNotExistException from "../../exception/member-not-exist.exception";
import {
    ResponseStatus,
} from "../../response/response-status";
import ChatRoomNotExistsException from "../../exception/chat-room-not-exists.exception";
import InvalidSendChatRequestException from "../../exception/invalid-send-chat-request.exception";

@Injectable()
export default class ChatService {
    constructor(@Inject(PrismaConfig) private readonly prisma: PrismaClient,) {
    }

    async saveChat(sendChatMessage: SendChatMessage, memberId: string) {
        const existsMember = await this.prisma.member.findUnique({
            where: {
                id: BigInt(memberId),
            },
        });

        if (!existsMember) {
            throw new MemberNotExistException(ResponseStatus.CHAT_F001);
        }

        const existsChatRoom = await this.prisma.chatRoom.findUnique({
            where: {
                id: BigInt(sendChatMessage.roomId),
            },
            include: {
                MemberRoom: true,
            },
        });

        if (!existsChatRoom) {
            throw new ChatRoomNotExistsException(ResponseStatus.CHAT_F002);
        }

        if (!existsChatRoom.MemberRoom
            .map(memberRoom => memberRoom.memberId)
            .includes(BigInt(memberId))) {
            throw new InvalidSendChatRequestException(ResponseStatus.CHAT_F003);
        }

        const chat = await this.prisma.chat.create({
            data: {
                message: sendChatMessage.message,
                memberId: BigInt(memberId),
                roomId: BigInt(sendChatMessage.roomId),
            },
        });

    }
}