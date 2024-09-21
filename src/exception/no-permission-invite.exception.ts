import {
    ResponseStatusType,
} from "../response/response-status";
import {
    ForbiddenException,
} from "./http/forbidden.exception";

export class NoPermissionInviteException extends ForbiddenException {
    constructor(errorCode: ResponseStatusType) {
        super("You do not have permission to invite members to this chat room.", errorCode);
    }
}