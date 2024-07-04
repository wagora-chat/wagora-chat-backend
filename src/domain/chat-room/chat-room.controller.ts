import {
    Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus,
} from "@nestjs/common";
import {
    ChatRoomService,
} from "./chat-room.service";
import {
    CreateChatRoomRequestDto,
} from "./dto/request/create-chat-room.request.dto";
import {
    ApiBearerAuth,
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    ApiCustomResponseDecorator,
} from "../../util/decorators/api-custom-response.decorator";
import CustomResponse from "../../response/custom-response";
import {
    CreateChatRoomResponseDto,
} from "./dto/response/create-chat-room.response.dto";
import {
    ResponseStatus,
} from "../../response/response-status";
import {
    JwtGuard,
} from "../auth/guards/jwt.guard";

@ApiTags("ChatRoom")
@UseGuards(JwtGuard)
@ApiBearerAuth("token")
@Controller("chat-rooms")
export class ChatRoomController {
    constructor(private readonly chatRoomService: ChatRoomService) {
    }

    @ApiOperation({
        summary: "채팅방 생성 API",
        description: "채팅방을 생성하고, 초기 유저들을 초대할 수 있다.",
    })
    @ApiCustomResponseDecorator(CreateChatRoomResponseDto)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createCharRoom(@Body() createChatRoomDto: CreateChatRoomRequestDto, @Request() req: any)
        : Promise<CustomResponse<CreateChatRoomResponseDto>> {
        const result = await this.chatRoomService.createChatRoom(createChatRoomDto, req.user);

        return new CustomResponse<CreateChatRoomResponseDto>(
            ResponseStatus.CHAT_ROOM_S001, result
        );
    }

}
