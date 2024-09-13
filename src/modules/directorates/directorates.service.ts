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

    /**
     * Retrieves all directorates that are not marked as deleted.
     *
     * @returns {Promise<Directorate[]>} A promise that resolves to an array of directorates.
     * @throws {DirectoratesNotFoundException} If no directorates are found.
     * @throws {Error} If there is an error during the retrieval process.
     */
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

    /**
     * Retrieves an array of Directorates based on the provided UUIDs.
     *
     * @param uuids - An array of UUIDs to search for in the database.
     * @returns A promise that resolves to an array of Directorates.
     * @throws DirectoratesNotFoundException - Thrown if no directorates are found for the given UUIDs.
     * @throws Error - Propagates any other errors encountered during the database query.
     */
    async findByUUIDs(uuids: string[]): Promise<Directorate[]> {
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

    /**
     * Retrieves a single Directorate by its UUID.
     *
     * @param uuid - The unique identifier of the Directorate to retrieve.
     * @returns A promise that resolves to the Directorate if found.
     * @throws DirectorateNotFoundException if no Directorate is found with the given UUID.
     * @throws Error if there is an issue during the retrieval process.
     */
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

    /**
     * Finds a Directorate by its name.
     *
     * @param name - The name of the Directorate to search for.
     * @returns A promise that resolves to the found Directorate.
     * @throws DirectorateNotFoundException if no Directorate with the given name is found or if an error occurs during the search.
     */
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

    /**
     * Creates a new directorate based on the provided DirectorateCreateDTO.
     *
     * This method performs the following steps:
     * 1. Validates the parent directorate if specified, throwing a
     *    DirectorateParentNotFoundException if the parent does not exist.
     * 2. Checks for name conflicts with existing directorates, throwing a
     *    DirectorateNameConflictException if a conflict is found.
     * 3. Creates a new directorate entity and saves it to the repository.
     *
     * @param directorateCreateDTO - The data transfer object containing the
     *                                details of the directorate to be created.
     * @throws DirectorateParentNotFoundException - If the specified parent
     *         directorate does not exist.
     * @throws DirectorateNameConflictException - If a directorate with the
     *         same name already exists.
     * @throws DirectorateCreateException - If there is an error during the
     *         creation of the directorate.
     * @returns A promise that resolves to void.
     */
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

    /**
     * Deletes a directorate by its UUID.
     *
     * @param uuid - The unique identifier of the directorate to be deleted.
     * @param soft - A boolean indicating whether to perform a soft delete (default is true).
     *
     * @throws DirectorateNotFoundException - If no directorate is found with the given UUID.
     * @throws DirectorateHasChildrenException - If the directorate has child entities and cannot be deleted.
     * @throws DirectorateDeleteException - If an error occurs during the deletion process.
     *
     * @returns A promise that resolves to void.
     */
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
