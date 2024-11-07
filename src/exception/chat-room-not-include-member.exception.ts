import {
    BadRequestException,
} from "./http/bad-request.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export default class ChatRoomNotIncludeMemberException extends BadRequestException {
    constructor(errorCode: ResponseStatusType) {
        super("Chat Room Not Include Member", errorCode);
    }
}