import {
    IsNumber,
} from "class-validator";

export default class LeaveChatRoomMessage {
    @IsNumber()
    roomId: bigint;
}