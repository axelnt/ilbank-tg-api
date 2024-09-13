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

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Department)
        private departmentsRepository: Repository<Department>,
    ) {}

    async findAll(): Promise<Department[]> {
        try {
            const departments = await this.departmentsRepository.find({
                where: { deleted: false },
            });

            if (!departments.length) {
                throw new DepartmentsNotFoundException();
            }

            return departments;
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

    async findOne(uuid: string): Promise<Department> {
        try {
            const department = await this.departmentsRepository.findOne({
                where: { uuid, deleted: false },
            });

            if (!department) {
                throw new DepartmentNotFoundException(uuid);
            }

            return department;
        } catch (error) {
            throw error;
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

    async create(departmentCreateDTO: DepartmentCreateDTO): Promise<void> {
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
                await this.departmentsRepository.save(department);

                return;
            } catch (error) {
                throw new DepartmentCreateException();
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(uuid: string, soft: boolean = true): Promise<void> {
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

            return;
        } catch (error) {
            throw new DepartmentDeleteException(uuid);
        }
    }
}
