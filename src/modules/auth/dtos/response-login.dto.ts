import { Expose, plainToInstance } from 'class-transformer';

export class ResponseLoginDTO {
    @Expose()
    token: string;

    static toDTO(token: string): ResponseLoginDTO {
        return plainToInstance(ResponseLoginDTO, {
            token,
        });
    }
}
