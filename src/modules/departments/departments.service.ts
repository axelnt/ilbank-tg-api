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

    /**
     * Retrieves all departments that are not marked as deleted.
     *
     * @returns {Promise<Department[]>} A promise that resolves to an array of Department objects.
     * @throws {DepartmentsNotFoundException} If no departments are found.
     * @throws {Error} If there is an error during the retrieval process.
     */
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

    /**
     * Finds departments by their UUIDs.
     *
     * @param uuids - An array of UUIDs to search for.
     * @returns A promise that resolves to an array of Department objects.
     * @throws DepartmentsNotFoundException - If no departments are found with the provided UUIDs.
     * @throws Error - If an error occurs during the database query.
     */
    async findByUUIDs(uuids: string[]): Promise<Department[]> {
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

    /**
     * Retrieves a department by its unique identifier (UUID).
     *
     * @param uuid - The unique identifier of the department to retrieve.
     * @returns A promise that resolves to the found Department object.
     * @throws DepartmentNotFoundException - If no department is found with the given UUID or if the department is marked as deleted.
     */
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

    /**
     * Finds a department by its name.
     *
     * @param name - The name of the department to search for.
     * @returns A promise that resolves to the found Department.
     * @throws DepartmentNotFoundException if no department with the given name exists or if it is marked as deleted.
     */
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

    /**
     * Creates a new department.
     *
     * @param departmentCreateDTO - The data transfer object containing the details of the department to be created.
     * @throws DepartmentNameConflictException - Thrown if a department with the same name already exists.
     * @throws DepartmentCreateException - Thrown if there is an error while saving the department.
     * @returns A promise that resolves to void.
     */
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

    /**
     * Deletes a department by its UUID.
     *
     * This method can perform either a soft delete or a hard delete based on the `soft` parameter.
     * A soft delete marks the department as deleted without removing it from the database,
     * while a hard delete permanently removes the department.
     *
     * @param uuid - The UUID of the department to delete.
     * @param soft - A boolean indicating whether to perform a soft delete (default is true).
     * @throws DepartmentNotFoundException - If no department with the given UUID exists and is not marked as deleted.
     * @throws DepartmentDeleteException - If an error occurs during the deletion process.
     * @returns A promise that resolves to void.
     */
    async delete(uuid: string, soft: boolean = true): Promise<void> {
        try {
            const department = await this.departmentsRepository.findOne({
                where: { uuid, deleted: false },
            });

            if (!department) {
                throw new DepartmentNotFoundException(uuid);
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
