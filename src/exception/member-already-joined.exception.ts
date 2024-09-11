import {
    BadRequestException,
} from "./http/bad-request.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export class MemberAlreadyJoinedException extends BadRequestException {
    constructor(errorCode: ResponseStatusType) {
        super("Member already in chat room", errorCode);
    }
}