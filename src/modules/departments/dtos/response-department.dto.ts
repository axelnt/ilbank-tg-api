import { Department } from '@common/entities/department.entity';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

@Exclude()
export class ResponseDepartmentDTO {
    @Expose()
    uuid: string;

    @Expose()
    name: string;

    static toDTO<T extends Department | Department[]>(
        department: T,
    ): T extends Department[]
        ? ResponseDepartmentDTO[]
        : ResponseDepartmentDTO {
        return plainToInstance(ResponseDepartmentDTO, department) as any;
    }
}
