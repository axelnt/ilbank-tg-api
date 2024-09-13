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

@Injectable()
export class DirectoratesService {
    constructor(
        @InjectRepository(Directorate)
        private directoratesRepository: Repository<Directorate>,
    ) {}

    async findAll(): Promise<Directorate[]> {
        try {
            const directorates = await this.directoratesRepository.find({
                where: { deleted: false },
                relations: ['children', 'parent'],
            });

            if (!directorates.length) {
                throw new DirectoratesNotFoundException();
            }

            console.log(directorates);

            return directorates;
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

    async findOne(uuid: string): Promise<Directorate> {
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

    async findOneWithName(name: string): Promise<Directorate> {
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

    async create(directorateCreateDTO: DirectorateCreateDTO): Promise<void> {
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
                await this.directoratesRepository.save(directorate);
            } catch (error) {
                throw new DirectorateCreateException();
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(uuid: string, soft: boolean = true): Promise<void> {
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
        } catch (error) {
            throw new DirectorateDeleteException(uuid);
        }
    }
}
