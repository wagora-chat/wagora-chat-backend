import {
    ArgumentMetadata, PipeTransform,
} from "@nestjs/common";
import GetChatRoomQueryDto from "../dto/request/get-chat-room.query.dto";
import InvalidParamsException from "../../../exception/invalid-params.exception";

export default class GetChatRoomQueryPipe implements PipeTransform {
    transform(value: GetChatRoomQueryDto, metadata: ArgumentMetadata): any {
        if (value.name !== undefined && value.members !== undefined) {
            throw new InvalidParamsException();
        }

        return value;

    }
}