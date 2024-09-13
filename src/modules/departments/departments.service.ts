import { Department } from '@modules/common/entities/department.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
    DepartmentCreateException,
    DepartmentDeleteException,
    DepartmentNameConflictException,
    DepartmentNotFoundException,
    DepartmentsNotFoundException,
} from './departments.exceptions';
import { DepartmentCreateDTO } from './dtos/create.dto';
import { ResponseDepartmentDeleteDTO } from './dtos/response-department-delete.dto';
import { ResponseDepartmentDTO } from './dtos/response-department.dto';
import { ResponseDepartmentsDTO } from './dtos/response-departments.dto';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Department)
        private departmentsRepository: Repository<Department>,
    ) {}

    async findAll(): Promise<ResponseDepartmentsDTO> {
        try {
            const departments = await this.departmentsRepository.find({
                where: { deleted: false },
            });

            if (!departments.length) {
                throw new DepartmentsNotFoundException();
            }

            return new ResponseDepartmentsDTO(departments);
        } catch (error) {
            throw error;
        }
    }

    async findMany(uuids: string[]): Promise<Department[]> {
        try {
            const departments = await this.departmentsRepository.find({
                where: { uuid: In(uuids), deleted: false },
            });

            if (!departments.length) {
                throw new DepartmentsNotFoundException();
            }

            return departments;
        } catch (error) {
            throw error;
        }
    }

    async findOne(uuid: string): Promise<ResponseDepartmentDTO> {
        try {
            const department = await this.departmentsRepository.findOne({
                where: { uuid, deleted: false },
            });

            if (!department) {
                throw new DepartmentNotFoundException(uuid);
            }

            return new ResponseDepartmentDTO(department);
        } catch (error) {
            throw error;
        }
    }

    async create(
        departmentCreateDTO: DepartmentCreateDTO,
    ): Promise<ResponseDepartmentDTO> {
        try {
            try {
                const existingDepartment = await this.findOneWithName(
                    departmentCreateDTO.name,
                );

                if (existingDepartment) {
                    throw new DepartmentNameConflictException(
                        departmentCreateDTO.name,
                    );
                }
            } catch (error) {
                if (!(error instanceof DepartmentNotFoundException)) {
                    throw error;
                }
            }

            const department = this.departmentsRepository.create({
                name: departmentCreateDTO.name,
            });

            try {
                const savedDepartment =
                    await this.departmentsRepository.save(department);

                return new ResponseDepartmentDTO(savedDepartment);
            } catch (error) {
                throw new DepartmentCreateException();
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(
        uuid: string,
        soft: boolean = true,
    ): Promise<ResponseDepartmentDeleteDTO> {
        try {
            const department = await this.departmentsRepository.findOne({
                where: { uuid, deleted: false },
            });

            if (!department) {
                throw new Error('Department not found');
            }

            if (soft) {
                department.deleted = true;
                await this.departmentsRepository.save(department);
            } else {
                await this.departmentsRepository.remove(department);
            }

            return new ResponseDepartmentDeleteDTO();
        } catch (error) {
            throw new DepartmentDeleteException(uuid);
        }
    }

    async findOneWithName(name: string): Promise<Department> {
        try {
            const department = await this.departmentsRepository.findOne({
                where: { name, deleted: false },
            });

            if (!department) {
                throw new DepartmentNotFoundException(name);
            }

            return department;
        } catch (error) {
            throw error;
        }
    }
}
