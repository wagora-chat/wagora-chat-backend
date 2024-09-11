import {
    ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer,
} from "@nestjs/websockets";

import {
    Server,
} from "socket.io";
import {
    Logger, UseFilters, UseGuards, UsePipes,
} from "@nestjs/common";
import {
    WebSocketJwtGuard,
} from "./guards/websocket.jwt.guard";
import JoinChatRoomMessage from "./dto/join-chat-room.message";
import SendChatMessage from "./dto/send-chat.message";
import LeaveChatRoomMessage from "./dto/leave-chat-room.message";
import SocketMember from "./socket.member";
import ChatService from "./chat.service";
import WebSocketValidationPipe from "./pipe/websocket-validation.pipe";
import WebsocketExceptionFilter from "../../filter/websocket-exception.filter";

@UseFilters(WebsocketExceptionFilter)
@UsePipes(WebSocketValidationPipe)
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
        await this.chatService.validateRoomId(socketMessage.roomId);

        client.join(socketMessage.roomId.toString());
        this.logger.log("[chat - join] finish");
    }

    @SubscribeMessage("message")
    async handleMessage(@MessageBody() socketMessage: SendChatMessage, @ConnectedSocket() client: SocketMember) {
        this.logger.log("[chat - message] start");
        await this.chatService.saveChat(socketMessage, client.memberId);

        this.server.to(socketMessage.roomId.toString()).emit("message", {
            sender: client.memberId,
            message: socketMessage.message,
        });
        this.logger.log("[chat - message] finish");
    }

    @SubscribeMessage("leave")
    async leaveChatRoom(@MessageBody() socketMessage: LeaveChatRoomMessage, @ConnectedSocket() client: SocketMember) {
        this.logger.log("[chat - leave] start");
        await this.chatService.validateRoomId(socketMessage.roomId);

        client.leave(socketMessage.roomId.toString());
        client.disconnect();
        this.logger.log("[chat - leave] finish");
    }

}