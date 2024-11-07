import {
    ResponseStatusType,
} from "../response/response-status";
import {
    UnauthorizedException,
} from "./http/unauthorized.exception";

export default class InvalidJwtException extends UnauthorizedException {
    constructor(errorCode : ResponseStatusType) {
        super("Invalid JWT", errorCode);
    }
}