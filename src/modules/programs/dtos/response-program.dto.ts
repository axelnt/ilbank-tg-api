import { Department } from '@common/entities/department.entity';
import { Program } from '@common/entities/program.entity';

export class ResponseProgramDTO {
    code: string;
    name: string;
    users: string[];
    departments: Department[];
    directorates: Department[];
    processBased: boolean;

    constructor(program: Program) {
        this.code = program.code;
        this.name = program.name;
        this.users = program.users;
        this.departments = program.departments;
        this.directorates = program.directorates;
        this.processBased = program.processBased;
    }
}
