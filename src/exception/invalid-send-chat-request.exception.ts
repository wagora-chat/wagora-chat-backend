import {
    BadRequestException,
} from "./http/bad-request.exception";
import {
    ResponseStatusType,
} from "../response/response-status";

export default class InvalidSendChatRequestException extends BadRequestException {
    constructor(errorCode: ResponseStatusType) {
        super("Invalid Request to Send Chat", errorCode);
    }
}