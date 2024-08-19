import {
    ForbiddenException,
} from "./http/forbidden.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export default class InvalidAccessException extends ForbiddenException {
    constructor(errorCode: ResponseStatusType) {
        super("Invalid Access Token", errorCode);
    }
}