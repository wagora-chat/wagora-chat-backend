export class VerifyCodeEmailRequest {
    constructor(
        readonly email: string,
        readonly code: string
    ) {
    }
}