import {
    ResponseCode,
} from "../../../../../exception/error-code.enum";

export class SendCodeToEmailResponse {
    constructor(
        readonly code: ResponseCode,
        readonly data: SendCodeToEmailResponseData,
        readonly timestamp: Date
    ) {
    }
}

export class SendCodeToEmailResponseData {
    constructor(readonly email: string) {
    }
}