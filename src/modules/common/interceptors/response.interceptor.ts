import { APIResponse } from '@common/interfaces/response.interface';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, APIResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<APIResponse<T>> {
        return next.handle().pipe(
            map((data) => ({
                status: 'success',
                data: data && Object.keys(data).length ? data : undefined,
                message: undefined,
                timestamp: Date.now(),
            })),
        );
    }
}
