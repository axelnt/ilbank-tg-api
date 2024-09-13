import { Department } from '@common/entities/department.entity';
import { ResponseDepartmentDTO } from './response-department.dto';

export class ResponseDepartmentsDTO {
    departments: ResponseDepartmentDTO[];

    constructor(departments: Department[]) {
        this.departments = departments.map(
            (department) => new ResponseDepartmentDTO(department),
        );
    }

    static toEntities(departments: ResponseDepartmentDTO[]): Department[] {
        return departments.map((department) =>
            ResponseDepartmentDTO.toEntity(department),
        );
    }
}
