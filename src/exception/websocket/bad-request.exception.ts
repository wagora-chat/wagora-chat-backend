import {
    WsException,
} from "@nestjs/websockets";
import {
    ResponseStatusType,
} from "../../response/response-status";

export default class BadRequestException extends WsException {
    constructor(message: string, errorCode: ResponseStatusType) {
        super({
            message,
            errorCode,
        });
    }
}