import {
    IsNumber,
} from "class-validator";

export default class JoinChatRoomMessage {
    @IsNumber()
    roomId: bigint;
}