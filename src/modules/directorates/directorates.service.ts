import { Directorate } from '@modules/common/entities/directorate.entity';
import { DirectorateCreateDTO } from '@modules/directorates/dtos/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
    DirectorateCreateException,
    DirectorateDeleteException,
    DirectorateHasChildrenException,
    DirectorateNameConflictException,
    DirectorateNotFoundException,
    DirectorateParentNotFoundException,
    DirectoratesNotFoundException,
} from './directorates.exception';
import { ResponseDirectorateDeleteDTO } from './dtos/response-directorate-delete.dto';
import { ResponseDirectorateDTO } from './dtos/response-directorate.dto';
import { ResponseDirectoratesDTO } from './dtos/response-directorates.dto';

@Injectable()
export class DirectoratesService {
    constructor(
        @InjectRepository(Directorate)
        private directoratesRepository: Repository<Directorate>,
    ) {}

    async findAll(): Promise<ResponseDirectoratesDTO> {
        try {
            const directorates = await this.directoratesRepository.find({
                where: { deleted: false },
            });

            if (!directorates.length) {
                throw new DirectoratesNotFoundException();
            }

            return new ResponseDirectoratesDTO(directorates);
        } catch (error) {
            throw error;
        }
    }

    async findMany(uuids: string[]): Promise<Directorate[]> {
        try {
            const directorates = await this.directoratesRepository.find({
                where: { uuid: In(uuids), deleted: false },
            });

            if (!directorates) {
                throw new DirectoratesNotFoundException();
            }

            return directorates;
        } catch (error) {
            throw error;
        }
    }

    async findOne(uuid: string): Promise<ResponseDirectorateDTO> {
        try {
            const directorate = await this.directoratesRepository.findOne({
                where: { uuid, deleted: false },
            });

            if (!directorate) {
                throw new DirectorateNotFoundException(uuid);
            }

            return directorate;
        } catch (error) {
            throw error;
        }
    }

    async create(
        directorateCreateDTO: DirectorateCreateDTO,
    ): Promise<ResponseDirectorateDTO> {
        try {
            let parent: Directorate = null;
            if (directorateCreateDTO.parent) {
                try {
                    parent = await this.directoratesRepository.findOne({
                        where: {
                            uuid: directorateCreateDTO.parent,
                            deleted: false,
                        },
                    });

                    if (!parent) {
                        throw new DirectorateParentNotFoundException(
                            directorateCreateDTO.parent,
                        );
                    }
                } catch (error) {
                    throw new DirectorateParentNotFoundException(
                        directorateCreateDTO.parent,
                    );
                }
            }

            try {
                const existingDirectorate = await this.findOneWithName(
                    directorateCreateDTO.name,
                );

                if (existingDirectorate) {
                    throw new DirectorateNameConflictException(
                        directorateCreateDTO.name,
                    );
                }
            } catch (error) {
                if (!(error instanceof DirectorateNotFoundException)) {
                    throw error;
                }
            }

            const directorate = this.directoratesRepository.create({
                name: directorateCreateDTO.name,
                parent,
            });

            try {
                const savedDirectorate =
                    await this.directoratesRepository.save(directorate);

                return new ResponseDirectorateDTO(savedDirectorate);
            } catch (error) {
                throw new DirectorateCreateException();
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(
        uuid: string,
        soft: boolean = true,
    ): Promise<ResponseDirectorateDeleteDTO> {
        try {
            const directorate = await this.directoratesRepository.findOne({
                where: { uuid, deleted: false },
            });

            if (!directorate) {
                throw new DirectorateNotFoundException(uuid);
            }

            if (directorate.children.length) {
                throw new DirectorateHasChildrenException();
            }

            if (soft) {
                directorate.deleted = true;
                await this.directoratesRepository.save(directorate);
            } else {
                await this.directoratesRepository.remove(directorate);
            }

            return new ResponseDirectorateDeleteDTO();
        } catch (error) {
            throw new DirectorateDeleteException(uuid);
        }
    }

    async findOneWithName(name: string): Promise<ResponseDirectorateDTO> {
        try {
            const directorate = await this.directoratesRepository.findOne({
                where: { name, deleted: false },
            });

            if (!directorate) {
                throw new DirectorateNotFoundException(name);
            }

            return directorate;
        } catch (error) {
            throw error;
        }
    }
}
