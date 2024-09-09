import {
    ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer,
} from "@nestjs/websockets";

import {
    Server,
} from "socket.io";
import {
    Logger,
    UseGuards,
} from "@nestjs/common";
import {
    WebSocketJwtGuard,
} from "./guards/websocket.jwt.guard";
import JoinChatRoomMessage from "./dto/join-chat-room.message";
import SendChatMessage from "./dto/send-chat.message";
import LeaveChatRoomMessage from "./dto/leave-chat-room.message";
import SocketMember from "./socket.member";
import ChatService from "./chat.service";

@UseGuards(WebSocketJwtGuard)
@WebSocketGateway({
    namespace: "chat",
})
export default class ChatGateway {
    @WebSocketServer()
    private readonly server: Server;
    private readonly logger: Logger = new Logger(ChatGateway.name);

    constructor(private readonly chatService: ChatService) {
    }

    @SubscribeMessage("join")
    async joinChatRoom(@MessageBody() socketMessage: JoinChatRoomMessage, @ConnectedSocket() client: SocketMember) {
        this.logger.log("[chat - join] start");
        client.join(socketMessage.roomId);
        this.logger.log("[chat - join] finish");
    }

    @SubscribeMessage("message")
    async handleMessage(@MessageBody() socketMessage: SendChatMessage, @ConnectedSocket() client: SocketMember) {
        this.logger.log("[chat - message] start");
        await this.chatService.saveChat(socketMessage, client.memberId);

        this.server.to(socketMessage.roomId).emit("message", {
            sender: client.memberId,
            message: socketMessage.message,
        });
        this.logger.log("[chat - message] finish");
    }

    @SubscribeMessage("leave")
    async leaveChatRoom(@MessageBody() socketMessage: LeaveChatRoomMessage, @ConnectedSocket() client: SocketMember) {
        this.logger.log("[chat - message] start");
        client.leave(socketMessage.roomId);
        client.disconnect();
        this.logger.log("[chat - message] finish");
    }

}