import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Post, Query, UseGuards,
} from "@nestjs/common";
import {
    ChatRoomService,
} from "./chat-room.service";
import {
    CreateChatRoomRequestDto,
} from "./dto/request/create-chat-room.request.dto";
import {
    ApiBearerAuth, ApiOperation, ApiTags,
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
import {
    GetMember,
} from "../../util/decorators/get-member.decortator";
import {
    Member,
} from "@prisma/client";
import GetChatRoomQueryPipe from "./pipe/get-chat-room-query.pipe";
import GetChatRoomQueryDto from "./dto/request/get-chat-room.query.dto";
import GetChatRoomListResponseDto from "./dto/response/get-chat-room-list.response.dto";
import {
    LeaveChatRoomResponseDto,
} from "./dto/response/leave-chat-room.response.dto";
import {
    BigIntPipe,
} from "./pipe/bigint.pipe";

@ApiTags("ChatRoom")
@UseGuards(JwtGuard)
@ApiBearerAuth("token")
@Controller("chat-rooms")
export class ChatRoomController {
    private readonly logger = new Logger(ChatRoomController.name);

    constructor(private readonly chatRoomService: ChatRoomService) {
    }

    @ApiOperation({
        summary: "채팅방 생성 API",
        description: "채팅방을 생성하고, 초기 유저들을 초대할 수 있다.",
    })
    @ApiCustomResponseDecorator(CreateChatRoomResponseDto)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createChatRoom(@Body() createChatRoomDto: CreateChatRoomRequestDto, @GetMember() member: Member)
        : Promise<CustomResponse<CreateChatRoomResponseDto>> {
        this.logger.log("[createCharRoom] start");
        const result = await this.chatRoomService.createChatRoom(createChatRoomDto, member);
        this.logger.log("[createCharRoom] finish");

        return new CustomResponse<CreateChatRoomResponseDto>(
            ResponseStatus.CHAT_ROOM_S001, result
        );
    }

    @ApiOperation({
        summary: "채팅방 목록 조회 API",
        description: "요청한 회원이 포함된 채팅방을 조건에 맞게 조회할 수 있다.",
    })
    @ApiCustomResponseDecorator(Array<GetChatRoomListResponseDto>)
    @HttpCode(HttpStatus.OK)
    @Get()
    async getChatRoomList(@GetMember() member: Member,
                          @Query(GetChatRoomQueryPipe) params: GetChatRoomQueryDto) {
        this.logger.log("[getChatRoomList] start");
        const result = await this.chatRoomService.getChatRoomList(
            member.id, params.name, params.members
        );
        this.logger.log("[getChatRoomList] finish");

        return new CustomResponse(
            ResponseStatus.CHAT_ROOM_S002, result
        );
    }

    @ApiOperation({
        summary: "채팅방 나가기, 삭제 API",
        description: "채팅방 id를 기반으로 본인이 채팅방에서 나갈 수 있다.",
    })
    @ApiCustomResponseDecorator(LeaveChatRoomResponseDto)
    @HttpCode(HttpStatus.OK)
    @Delete(":id")
    async leaveChatRoom(@Param("id", BigIntPipe) id: bigint, @GetMember() member: Member) {
        this.logger.log("[leaveChatRoom] start");
        const result = await this.chatRoomService.leaveChatRoom(id, member);
        this.logger.log("[leaveChatRoom] finish");

        return new CustomResponse(
            ResponseStatus.CHAT_ROOM_S003, result
        );
    }

}
