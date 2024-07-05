import {
    Request, Response,
} from "express";
import {
    ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from "@nestjs/common";
import {
    ErrorDataDto,
} from "../response/error-data.dto";
import {
    ErrorExceptionType,
    isCustomErrorExceptionType,
    isDefaultErrorExceptionType,
} from "../type-guard/exception.type-guard";
import CustomResponse from "../response/custom-response";
import {
    ResponseStatus, ResponseStatusType,
} from "../response/response-status";

@Catch(HttpException)

export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const errorException = exception.getResponse() as ErrorExceptionType;
        let errorMessage: string;
        let code: ResponseStatusType;

        if (isCustomErrorExceptionType(errorException)) {
            errorMessage = errorException.message;
            code = errorException.errorCode;
        } else if (isDefaultErrorExceptionType(errorException)) {
            errorMessage = errorException.message;
            code = ResponseStatus.DEFAULT_F;
        } else {
            errorMessage = errorException;
            code = ResponseStatus.UNKNOWN_F;
        }
        this.logger.error(
            `Error Occur ${request.url} ${request.method}, code: [${code.code}, ${code.message}]
            , errorMessage: ${JSON.stringify(errorMessage, null, 2)}`,
        );

        const errorData: ErrorDataDto = {
            status: status,
            message: errorMessage,
            path: request.url,
            error: HttpStatus[status],
        };
        const errorResponse= new CustomResponse<ErrorDataDto>(
            code, errorData
        );

        response.status(status).json(errorResponse);
    }

}