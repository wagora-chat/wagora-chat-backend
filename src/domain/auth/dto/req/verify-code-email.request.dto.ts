export class VerifyCodeEmailRequestDto {
    constructor(
        readonly email: string,
        readonly code: string
    ) {
    }
}