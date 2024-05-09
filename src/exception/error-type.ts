import {
    ResponseCode,
} from "./error-code.enum";

export type ErrorResponseType = string | CustomErrorResponseType | DefaultErrorResponseType
export type CustomErrorResponseType = { message: string, errorCode: ResponseCode }
export type DefaultErrorResponseType = { message: string, status: number }

export function isCustomErrorResponseType(response: ErrorResponseType)
    : response is { message: string, errorCode: ResponseCode } {
    return typeof response === "object" && "message" in response && "errorCode" in response;
}

export function isDefaultErrorResponseType(response: ErrorResponseType)
    : response is { message: string, status: number } {
    return typeof response === "object" && "message" in response && "status" in response;
}