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

    async create(
        programCreateDTO: ProgramCreateDTO,
        file: Express.Multer.File,
    ): Promise<boolean> {
        try {
            try {
                const existingProgram = await this.programRepository.findOne({
                    where: { name: programCreateDTO.name, deleted: false },
                });

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

            const departments = await this.departmentsService.findMany(
                programCreateDTO.departments,
            );

            if (departments.length === 0) {
                throw new DepartmentsNotFoundException();
            }

            const directorates = await this.directoratesService.findMany(
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
