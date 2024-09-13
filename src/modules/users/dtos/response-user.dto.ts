import { User } from '@common/entities/user.entity';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

@Exclude()
export class ResponseUserDTO {
    @Expose()
    uuid: string;

    @Expose()
    username: string;

    @Expose()
    deleted: boolean;

    static toDTO<T extends User | User[]>(
        user: T,
    ): T extends User[] ? ResponseUserDTO[] : ResponseUserDTO {
        return plainToInstance(ResponseUserDTO, user) as any;
    }
}
