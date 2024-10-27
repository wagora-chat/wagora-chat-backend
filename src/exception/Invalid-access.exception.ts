import {
    ResponseStatusType,
} from "../response/response-status";
import {
    UnauthorizedException,
} from "./http/unauthorized.exception";

export default class InvalidAccessException extends UnauthorizedException {
    constructor(errorCode: ResponseStatusType) {
        super("Invalid Access Token", errorCode);
    }
}