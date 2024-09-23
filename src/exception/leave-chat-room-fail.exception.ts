import {
    BadRequestException,
} from "./http/bad-request.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export class LeaveChatRoomFailException extends BadRequestException {
    constructor(errorCode: ResponseStatusType) {
        super("Leave Chat Room Fail", errorCode);
    }
}