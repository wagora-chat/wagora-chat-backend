import {
    ResponseStatusType,
} from "../response/response-status";

export type ErrorExceptionType = string | CustomErrorResponseType | DefaultErrorResponseType
export type CustomErrorResponseType = { message: string, errorCode: ResponseStatusType }
export type DefaultErrorResponseType = { message: string, status: number }

export function isCustomErrorExceptionType(response: ErrorExceptionType)
    : response is { message: string, errorCode: ResponseStatusType } {
    return typeof response === "object" && "message" in response && "errorCode" in response;
}

export function isDefaultErrorExceptionType(response: ErrorExceptionType)
    : response is { message: string, status: number } {
    return typeof response === "object" && "message" in response && "status" in response;
}