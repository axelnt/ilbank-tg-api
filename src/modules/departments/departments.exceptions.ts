import {
    InternalServerError,
    NotFoundError,
} from '@common/interfaces/error.interface';

export class DepartmentsNotFoundException extends NotFoundError {
    constructor() {
        super('Departments not found');
    }
}

export class DepartmentNotFoundException extends NotFoundError {
    constructor(uuid: string) {
        super(`Department with id ${uuid} not found`);
    }
}

export class DepartmentNameConflictException extends NotFoundError {
    constructor(name: string) {
        super(`Department with name ${name} already exists`);
    }
}

export class DepartmentParentNotFoundException extends NotFoundError {
    constructor(uuid: string) {
        super(`Department with uuid ${uuid} not found`);
    }
}

export class DepartmentDeleteException extends InternalServerError {
    constructor(uuid: string) {
        super(`Error deleting department with uuid ${uuid}`);
    }
}

export class DepartmentCreateException extends InternalServerError {
    constructor() {
        super(`Error creating department`);
    }
}
