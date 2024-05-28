import {
    ResponseCode,
} from "../response/response-code.enum";

export type ErrorExceptionType = string | CustomErrorResponseType | DefaultErrorResponseType
export type CustomErrorResponseType = { message: string, errorCode: ResponseCode }
export type DefaultErrorResponseType = { message: string, status: number }

export function isCustomErrorExceptionType(response: ErrorExceptionType)
    : response is { message: string, errorCode: ResponseCode } {
    return typeof response === "object" && "message" in response && "errorCode" in response;
}

export function isDefaultErrorExceptionType(response: ErrorExceptionType)
    : response is { message: string, status: number } {
    return typeof response === "object" && "message" in response && "status" in response;
}