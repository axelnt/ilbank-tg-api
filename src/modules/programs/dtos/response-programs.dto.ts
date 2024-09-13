import { Program } from '@common/entities/program.entity';
import { ResponseProgramDTO } from './response-program.dto';

export class ResponseProgramsDTO {
    programs: ResponseProgramDTO[];

    constructor(programs: Program[]) {
        this.programs = programs.map(
            (program) => new ResponseProgramDTO(program),
        );
    }
}
