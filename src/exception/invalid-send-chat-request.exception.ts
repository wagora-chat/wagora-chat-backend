import {
    ResponseStatusType,
} from "../response/response-status";
import BadRequestException from "./websocket/bad-request.exception";

export default class InvalidSendChatRequestException extends BadRequestException {
    constructor(errorCode: ResponseStatusType) {
        super("Invalid Request to Send Chat", errorCode);
    }
}