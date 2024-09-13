import { APIResponse } from '@common/interfaces/response.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseBuilder<T> {
    private response: Partial<APIResponse<T>> = {
        status: 'success',
        timestamp: Date.now(),
    };

    message(message: string): this {
        this.response.message = message;
        return this;
    }

    data(data: T): this {
        this.response.data = data;
        return this;
    }

    build(): APIResponse<T> {
        return this.response as APIResponse<T>;
    }
}
