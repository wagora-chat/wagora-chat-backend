import {
    ResponseStatusType,
} from "./response-status";
import {
    ApiProperty,
} from "@nestjs/swagger";

export default class CustomResponse<T> {
    @ApiProperty({
        type: String,
        description: "응답 생성 시간",
        example: "2024-05-13T07:55:11.441Z",
    })
    readonly timestamp: string;

    @ApiProperty({
        description: "커스텀 응답 상태",
        type: Object,
        example: {
            code: "AUTH_S001",
            message: "POST /auth/signup",
        },
    })
    readonly customStatus: ResponseStatusType;
    readonly data: T;

    constructor(
        customStatus: ResponseStatusType,
        data: T,
    ) {
        this.timestamp = new Date().toISOString();
        this.customStatus = customStatus;
        this.data = data;
    }
}