import { FileNotFoundException } from '@common/exceptions/file.exceptions';
import { Program } from '@modules/common/entities/program.entity';
import { DepartmentsNotFoundException } from '@modules/departments/departments.exceptions';
import { DepartmentsService } from '@modules/departments/departments.service';
import { DirectoratesNotFoundException } from '@modules/directorates/directorates.exception';
import { DirectoratesService } from '@modules/directorates/directorates.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramCreateDTO } from '@programs/dtos/create.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Repository } from 'typeorm';
import {
    ProgramCreateException,
    ProgramDeleteException,
    ProgramNameConflictException,
    ProgramNotFoundWithCodeException,
    ProgramNotFoundWithNameException,
} from './programs.exceptions';

@Injectable()
export class ProgramsService {
    constructor(
        @InjectRepository(Program)
        private programRepository: Repository<Program>,
        private departmentsService: DepartmentsService,
        private directoratesService: DirectoratesService,
    ) {}

    /**
     * Retrieves all non-deleted programs from the repository.
     *
     * @returns {Promise<Program[]>} A promise that resolves to an array of Program objects.
     * @throws {Error} Throws an error if the retrieval fails.
     */
    async findAll(): Promise<Program[]> {
        try {
            const programs = await this.programRepository.find({
                where: { deleted: false },
            });

            return programs;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a program by its unique code.
     *
     * @param code - The unique code of the program to be retrieved.
     * @returns A promise that resolves to the found Program object.
     * @throws ProgramNotFoundWithCodeException - If no program is found with the given code.
     * @throws Error - If an unexpected error occurs during the retrieval process.
     */
    async findOne(code: string): Promise<Program> {
        try {
            const program = await this.programRepository.findOne({
                where: { code, deleted: false },
            });

            if (!program) {
                throw new ProgramNotFoundWithCodeException(code);
            }

            return program;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a program by its name.
     *
     * @param name - The name of the program to search for.
     * @returns A promise that resolves to the found Program.
     * @throws ProgramNotFoundWithNameException - If no program with the specified name exists and is not marked as deleted.
     */
    async findOneWithName(name: string): Promise<Program> {
        try {
            const program = await this.programRepository.findOne({
                where: { name, deleted: false },
            });

            if (!program) {
                throw new ProgramNotFoundWithNameException(name);
            }

            return program;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates a new program with the specified details and file.
     *
     * @param programCreateDTO - The data transfer object containing program details.
     * @param file - The file associated with the program, uploaded via Multer.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     * @throws ProgramNameConflictException - If a program with the same name already exists.
     * @throws DepartmentsNotFoundException - If no departments are found based on the provided IDs.
     * @throws DirectoratesNotFoundException - If no directorates are found based on the provided IDs.
     * @throws FileNotFoundException - If the uploaded file is missing or has no filename.
     * @throws ProgramCreateException - If there is an error saving the program to the repository.
     */
    async create(
        programCreateDTO: ProgramCreateDTO,
        file: Express.Multer.File,
    ): Promise<boolean> {
        try {
            try {
                const existingProgram = await this.findOneWithName(
                    programCreateDTO.name,
                );

                if (existingProgram) {
                    throw new ProgramNameConflictException(
                        programCreateDTO.name,
                    );
                }
            } catch (error) {
                if (!(error instanceof ProgramNotFoundWithNameException)) {
                    throw error;
                }
            }

            const departments = await this.departmentsService.findByUUIDs(
                programCreateDTO.departments,
            );

            if (departments.length === 0) {
                throw new DepartmentsNotFoundException();
            }

            const directorates = await this.directoratesService.findByUUIDs(
                programCreateDTO.directorates,
            );

            if (directorates.length === 0) {
                throw new DirectoratesNotFoundException();
            }

            const program = this.programRepository.create({
                name: programCreateDTO.name,
                users: programCreateDTO.users,
                departments: departments,
                directorates: directorates,
                processBased: programCreateDTO.processBased,
            });

            if (!file || !file.filename) {
                throw new FileNotFoundException('File is required');
            }

            /**
             * Generating the program code
             */
            program.code = await this.getNextCode(
                programCreateDTO.processBased,
            );

            const extension = path.extname(file.filename);
            const newFilename = `${program.code}${extension}`;

            /**
             * Renaming the file
             */
            const oldPath = path.join('./public', file.filename);
            const newPath = path.join('./public', newFilename);
            await fs.rename(oldPath, newPath);

            try {
                await this.programRepository.save(program);
                return true;
            } catch (error) {
                throw new ProgramCreateException();
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Deletes a program by its code.
     *
     * @param code - The unique code of the program to be deleted.
     * @param soft - A boolean indicating whether to perform a soft delete (default is true).
     *               If true, the program will be marked as deleted without removing it from the database.
     *               If false, the program will be permanently removed from the database.
     * @returns A promise that resolves to true if the deletion was successful.
     * @throws ProgramNotFoundWithCodeException - If no program is found with the given code.
     * @throws ProgramDeleteException - If an error occurs during the deletion process.
     */
    async delete(code: string, soft: boolean = true): Promise<boolean> {
        try {
            const program = await this.programRepository.findOne({
                where: { code: code, deleted: false },
            });

            if (!program) {
                throw new ProgramNotFoundWithCodeException(code);
            }

            if (soft) {
                program.deleted = true;
                await this.programRepository.save(program);
            } else {
                await this.programRepository.remove(program);
            }

            return true;
        } catch (error) {
            throw new ProgramDeleteException(code);
        }
    }

    /**
     * Retrieves the next program code based on the specified process type.
     *
     * @param {boolean} [processBased=false] - Indicates whether the code should be for process-based programs.
     * @returns {Promise<string>} A promise that resolves to the next program code in the format of 'SBxxxx' or 'BBxxxx'.
     *
     * @throws {Error} Throws an error if there is an issue retrieving the program codes from the repository.
     */
    private async getNextCode(processBased: boolean = false): Promise<string> {
        try {
            const prefix = processBased ? 'SB' : 'BB';

            const programs = await this.programRepository.find({
                where: {
                    processBased: processBased,
                },
                order: {
                    code: 'DESC',
                },
            });

            const lastProgram = programs.reduce((max, current) => {
                const extractNumber = (str: string) =>
                    parseInt(str.replace(/\D+/g, ''), 10);

                return extractNumber(current.code) > extractNumber(max.code)
                    ? current
                    : max;
            }, programs[0]);

            if (!lastProgram) {
                return `${prefix}0001`;
            }

            const lastCode = parseInt(lastProgram.code.slice(2), 10);
            const nextCode = lastCode + 1;
            return `${prefix}${nextCode.toString().padStart(4, '0')}`;

            return '';
        } catch (error) {
            throw error;
        }
    }
}
