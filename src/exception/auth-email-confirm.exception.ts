import {
    ForbiddenException,
} from "./http/forbidden.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export class AuthEmailConfirmException extends ForbiddenException {
    constructor(errorCode: ResponseStatusType) {
        super("Invalid Email", errorCode);
    }
}