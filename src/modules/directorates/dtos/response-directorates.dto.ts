import { Directorate } from '@common/entities/directorate.entity';
import { ResponseDirectorateDTO } from './response-directorate.dto';

export class ResponseDirectoratesDTO {
    directorates: ResponseDirectorateDTO[];

    constructor(directorates: Directorate[]) {
        this.directorates = directorates.map(
            (directorate) => new ResponseDirectorateDTO(directorate),
        );
    }

    static toEntities(directorates: ResponseDirectorateDTO[]): Directorate[] {
        return directorates.map((directorate) =>
            ResponseDirectorateDTO.toEntity(directorate),
        );
    }
}
