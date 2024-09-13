import { Department } from '@common/entities/department.entity';
import { Program } from '@common/entities/program.entity';
import { Expose, plainToInstance } from 'class-transformer';

export class ResponseProgramDTO {
    @Expose()
    code: string;

    @Expose()
    name: string;

    @Expose()
    users: string[];

    @Expose()
    departments: Department[];

    @Expose()
    directorates: Department[];

    @Expose()
    processBased: boolean;

    static toDTO<T extends Program | Program[]>(
        program: T,
    ): T extends Program[] ? ResponseProgramDTO[] : ResponseProgramDTO {
        return plainToInstance(ResponseProgramDTO, program) as any;
    }
}
