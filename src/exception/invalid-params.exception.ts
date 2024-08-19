import {
    BadRequestException,
} from "./http/bad-request.exception";
import {
    ResponseStatus,
} from "../response/response-status";

export default class InvalidParamsException extends BadRequestException {
    constructor() {
        super("Invalid Query Params", ResponseStatus.CHAT_ROOM_F002);
    }
}