import {
    WsException,
} from "@nestjs/websockets";
import {
    ResponseStatusType,
} from "../../response/response-status";

export default class NotFoundException extends WsException {
    constructor(message: string, errorCode: ResponseStatusType) {
        super({
            message,
            errorCode,
        });
    }
}