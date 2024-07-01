import {
    ForbiddenException,
} from "./http/forbidden.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export default class InvalidJwtException extends ForbiddenException {
    constructor(errorCode : ResponseStatusType) {
        super("Invalid JWT", errorCode);
    }
}