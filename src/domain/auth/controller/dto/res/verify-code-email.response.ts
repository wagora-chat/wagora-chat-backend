import {
    ResponseCode,
} from "../../../../../exception/error-code.enum";

export class VerifyCodeEmailResponse {
    constructor(
        readonly code: ResponseCode,
        readonly data: VerifyCodeEmailResponseData,
        readonly timestamp: Date
    ) {
    }
}

export class VerifyCodeEmailResponseData {
    constructor(readonly email: string) {
    }
}