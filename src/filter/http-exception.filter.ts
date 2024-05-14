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
    ResponseCode,
} from "../response/response-code.enum";

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
        let code: ResponseCode;

        if (isCustomErrorExceptionType(errorException)) {
            errorMessage = errorException.message;
            code = errorException.errorCode;
        } else if (isDefaultErrorExceptionType(errorException)) {
            errorMessage = errorException.message;
            code = ResponseCode.DEFAULT_F001;
        } else {
            errorMessage = errorException;
            code = ResponseCode.UNKNOWN_F001;
        }
        this.logger.error(
            `Error Occur ${request.url} ${request.method}, errorMessage: ${JSON.stringify(errorMessage, null, 2)}`,
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