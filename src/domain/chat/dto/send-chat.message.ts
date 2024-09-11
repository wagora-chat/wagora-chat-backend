import {
    IsNotEmpty, IsNumber,
} from "class-validator";

export default class SendChatMessage {
    @IsNumber()
    roomId: bigint;

    @IsNotEmpty()
    message: string;
}