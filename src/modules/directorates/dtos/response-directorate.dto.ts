import { Directorate } from '@common/entities/directorate.entity';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';

@Exclude()
export class ResponseDirectorateDTO {
    @Expose()
    uuid: string;

    @Expose()
    name: string;

    @Expose()
    @Type(() => ResponseDirectorateDTO)
    children: ResponseDirectorateDTO[];

    @Expose()
    @Type(() => ResponseDirectorateDTO)
    parent: ResponseDirectorateDTO;

    private static clean(dto: ResponseDirectorateDTO): void {
        if (!dto.parent) {
            delete dto.parent;
        }

        if (!dto.children || dto.children.length === 0) {
            delete dto.children;
        }
    }

    // Main toDTO method
    static toDTO<T extends Directorate | Directorate[]>(
        directorate: T,
    ): T extends Directorate[]
        ? ResponseDirectorateDTO[]
        : ResponseDirectorateDTO {
        const dto = plainToInstance(ResponseDirectorateDTO, directorate);

        if (Array.isArray(dto)) {
            dto.forEach((d) => this.clean(d));
        } else {
            this.clean(dto as ResponseDirectorateDTO);
        }

        return dto as T extends Directorate[]
            ? ResponseDirectorateDTO[]
            : ResponseDirectorateDTO;
    }
}
