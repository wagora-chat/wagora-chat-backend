import {
    WsException,
} from "@nestjs/websockets";

export default class UnauthorizedException extends WsException {}