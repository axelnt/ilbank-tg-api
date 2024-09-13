import {
    ConflictError,
    NotFoundError,
} from '@common/interfaces/error.interface';
import { APIResponse } from '@common/interfaces/response.interface';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status: number;
        let message: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message =
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : (exceptionResponse as any).message || 'Unexpected error';
        } else {
            if (exception instanceof NotFoundError) {
                status = HttpStatus.NOT_FOUND;
            } else if (exception instanceof ConflictError) {
                status = HttpStatus.CONFLICT;
            } else if (exception instanceof Error) {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            message = (exception as Error).message || 'Internal server error';
        }

        const responsePayload: APIResponse<null> = {
            status: 'error',
            message,
            timestamp: Date.now(),
        };

        response.status(status).json(responsePayload);
    }
}
