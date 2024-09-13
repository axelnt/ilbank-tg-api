import { Department } from '@common/entities/department.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class ResponseDepartmentDTO {
    uuid: string;
    name: string;

    constructor(department: Department) {
        this.uuid = department.uuid;
        this.name = department.name;
    }

    static toEntity(dto: ResponseDepartmentDTO): Department {
        const data = instanceToPlain(dto);
        return plainToInstance(Department, data);
    }
}
