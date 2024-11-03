import {
    Body,
    Controller,
    Delete, FileTypeValidator,
    Get,
    HttpCode,
    HttpStatus,
    Logger, MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards, UseInterceptors,
} from "@nestjs/common";
import {
    ChatRoomService,
} from "./chat-room.service";
import {
    CreateChatRoomRequestDto,
} from "./dto/request/create-chat-room.request.dto";
import {
    ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags,
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
import {
    InviteChatRoomResponseDto,
} from "./dto/response/invite-chat-room.response.dto";
import {
    InviteChatRoomRequestDto,
} from "./dto/request/invite-chat-room.request.dto";
import DelegateAdminResponseDto from "./dto/response/delegate-admin.response.dto";
import DelegateAdminRequestDto from "./dto/request/delegate-admin.request.dto";
import {
    UpdateChatRoomResponseDto,
} from "./dto/response/update-chat-room.response.dto";
import {
    UpdateChatRoomRequestDto,
} from "./dto/request/update-chat-room.request.dto";
import GetChatRoomMembersResponseDto from "./dto/response/get-chat-room-members.response.dto";
import GetNonMembersInChatRoomResponseDto from "./dto/response/get-non-members-in-chat-room.response.dto";
import {
    CreateRoomFileRequestDto,
} from "./dto/request/create-room-file.request.dto";
import {
    CreateRoomFileResponseDto,
} from "./dto/response/create-room-file.response.dto";
import {
    FileInterceptor,
} from "@nestjs/platform-express";

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
        this.logger.log("[createChatRoom] start");
        const result = await this.chatRoomService.createChatRoom(createChatRoomDto, member);
        this.logger.log("[createChatRoom] finish");

        return new CustomResponse<CreateChatRoomResponseDto>(
            ResponseStatus.CHAT_ROOM_S001, result
        );
    }

    @ApiOperation({
        summary: "채팅방 초대 API",
        description: "회원 ID로 채팅방에 회원을 초대할 수 있다.",
    })
    @ApiCustomResponseDecorator(InviteChatRoomResponseDto)
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Post("/:id")
    async inviteChatRoom(
        @Param("id", BigIntPipe) chatRoomId: bigint,
        @Body() body: InviteChatRoomRequestDto,
        @GetMember() member: Member
    ): Promise<CustomResponse<InviteChatRoomResponseDto>> {
        this.logger.log("[inviteChatRoom] start");

        const result = await this.chatRoomService.inviteChatRoom(chatRoomId, body.ids, member.id);

        this.logger.log("[inviteChatRoom] finish");

        return new CustomResponse<InviteChatRoomResponseDto>(
            ResponseStatus.CHAT_ROOM_S004, result
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
        summary: "채팅방 내에 속한 회원 조회 API",
        description: "채팅방 내에 속한 회원들을 조회한다.",
    })
    @ApiCustomResponseDecorator(GetChatRoomMembersResponseDto)
    @Get("/:id/members")
    async getChatRoomMembers(
        @Param("id", BigIntPipe) chatRoomId: bigint) {
        this.logger.log("[getChatRoomMembers] start");
        const result = await this.chatRoomService.getChatRoomMembers(chatRoomId);
        this.logger.log("[getChatRoomMembers] finish");

        return new CustomResponse(
            ResponseStatus.CHAT_ROOM_S007, result
        );
    }

    @ApiOperation({
        summary: "채팅방에 속하지 않은 회원 조회 API",
        description: "채팅방 초대 시, 채팅방에 속하지 않은 회원만 조회한다.",
    })
    @ApiCustomResponseDecorator(GetNonMembersInChatRoomResponseDto)
    @Get("/:id/non-members")
    async getNonMembersInChatRoom(@Param("id", BigIntPipe) chatRoomId: bigint) {
        this.logger.log("[getNonMembersInChatRoom] start");
        const result = await this.chatRoomService.getNonMembersInChatRoom(chatRoomId);
        this.logger.log("[getNonMembersInChatRoom] finish");

        return new CustomResponse(
            ResponseStatus.CHAT_ROOM_S008, result
        );

    }

    @ApiOperation({
        summary: "채팅방 수정 API",
        description: "채팅방 이름과 색깔을 수정한다.",
    })
    @ApiCustomResponseDecorator(UpdateChatRoomResponseDto)
    @Patch("/:id")
    async updateChatRoom(@Body() requestDto: UpdateChatRoomRequestDto,
                         @Param("id", BigIntPipe) chatRoomId: bigint,
                         @GetMember() member: Member) {
        this.logger.log("[updateChatRoom] start");
        const result = await this.chatRoomService.updateChatRoom(requestDto, chatRoomId, BigInt(member.id));
        this.logger.log("[updateChatRoom] finish");

        return new CustomResponse(
            ResponseStatus.CHAT_ROOM_S006, result
        );
    }

    @ApiOperation({
        summary: "채팅방 관리자 권한 위임 API",
        description: "채팅방 id를 기반으로 관리자가 관리자 권한을 위임할 수 있다.",
    })
    @ApiCustomResponseDecorator(DelegateAdminResponseDto)
    @Patch(":id/delegate")
    async delegateAdminChatRoom(@Body() requestDto: DelegateAdminRequestDto,
                                @GetMember() member: Member,
                                @Param("id", BigIntPipe) id: bigint,) {
        this.logger.log("[delegateAdminChatRoom] start");
        const result = await this.chatRoomService.delegateAdmin(requestDto, member.id, id);
        this.logger.log("[delegateAdminChatRoom] finish");

        return new CustomResponse(
            ResponseStatus.CHAT_ROOM_S005, result
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

    @ApiOperation({
        summary: "채팅방에 파일 업로드",
        description: "채팅방 id를 기반으로 채팅방에 파일을 올릴 수 있다.",
    })
    @ApiCustomResponseDecorator(CreateRoomFileResponseDto)
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    @HttpCode(HttpStatus.OK)
    @Post(":id/files")
    async createRoomFile(
        // File이 Swagger에 보이도록 설정해둠
        @Body() dto: CreateRoomFileRequestDto,
        @Param("id", BigIntPipe) id: bigint,
        @GetMember() member: Member,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: true,
                validators: [
                    new MaxFileSizeValidator({
                        // 50mb 까지 업로드 가능
                        maxSize: 1024 * 1024 * 50,
                    }),
                    new FileTypeValidator({
                        // 확장자는 지정된 형식만 가능
                        fileType: /\.(zip|html|md|jpeg|jpg|png|mp4|mov)$|image\/(jpeg|jpg|png)$|video\/(mp4|quicktime)$/,
                    }),
                ],
            }),
        ) file: Express.Multer.File
    ): Promise<CustomResponse<CreateRoomFileResponseDto>> {
        this.logger.log("[leaveChatRoom] start");
        const result = await this.chatRoomService.createRoomFile(id, member, file);
        this.logger.log("[leaveChatRoom] finish");

        return new CustomResponse(
            ResponseStatus.CHAT_ROOM_S009, result
        );
    }

    @ApiOperation({
        summary: "채팅방 파일 삭제",
        description: "채팅방 id를 기반으로 채팅방에 파일을 올릴 수 있다.",
    })
    @ApiCustomResponseDecorator(CreateRoomFileResponseDto)
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id/files/:fileId")
    async deleteRoomFile(
        // File이 Swagger에 보이도록 설정해둠
        @Param("id", BigIntPipe) id: bigint,
        @Param("fileId", BigIntPipe) fileId: bigint,
        @GetMember() member: Member,
    ) {
        this.logger.log("[leaveChatRoom] start");
        await this.chatRoomService.deleteRoomFile(id, fileId, member);
        this.logger.log("[leaveChatRoom] finish");

        return;
    }
}
