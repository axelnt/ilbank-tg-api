import { Directorate } from '@common/entities/directorate.entity';
import { Exclude, instanceToPlain, plainToInstance } from 'class-transformer';

export class ResponseDirectorateDTO {
    uuid: string;
    name: string;

    @Exclude()
    parent: ResponseDirectorateDTO;

    constructor(directorate: Directorate) {
        this.uuid = directorate.uuid;
        this.name = directorate.name;
        this.parent = directorate.parent
            ? new ResponseDirectorateDTO(directorate.parent)
            : null;
    }

    static toEntity(dto: ResponseDirectorateDTO): Directorate {
        const data = instanceToPlain(dto);
        return plainToInstance(Directorate, data);
    }
}
