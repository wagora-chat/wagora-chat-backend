import {
    Controller, Get, HttpCode, HttpStatus, UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth, ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    JwtGuard,
} from "../auth/guards/jwt.guard";
import MemberService from "./member.service";
import {
    ApiCustomResponseDecorator,
} from "../../util/decorators/api-custom-response.decorator";
import GetChatRoomListResponseDto from "../chat-room/dto/response/get-chat-room-list.response.dto";
import {
    GetMember,
} from "../../util/decorators/get-member.decortator";
import {
    Member,
} from "@prisma/client";
import CustomResponse from "../../response/custom-response";
import {
    ResponseStatus,
} from "../../response/response-status";
import FindAllMemberListResponseDto from "./dto/find-all-member-list.response.dto";

@ApiTags("Member")
@UseGuards(JwtGuard)
@ApiBearerAuth("token")
@Controller("members")
export default class MemberController {
    constructor(private readonly memberService: MemberService) {
    }

    @ApiOperation({
        summary: "회원 목록 조회 API",
        description: "요청한 회원이 포함되지 않은 전체 회원 목록을 조회합니다.",
    })
    @ApiCustomResponseDecorator(Array<FindAllMemberListResponseDto>)
    @HttpCode(HttpStatus.OK)
    @Get()
    public async findAllMemberList(@GetMember() member: Member) {
        const result = await this.memberService.findAllMemberList(member.id);

        return new CustomResponse(
            ResponseStatus.MEMBER_S001, result
        );
    }
}