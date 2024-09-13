import {
    ConflictError,
    InternalServerError,
    NotFoundError,
} from '@common/interfaces/error.interface';

export class ProgramNotFoundWithCodeException extends NotFoundError {
    constructor(code: string) {
        super(`Program with code ${code} not found`);
    }
}

export class ProgramNotFoundWithNameException extends NotFoundError {
    constructor(name: string) {
        super(`Program with name ${name} not found`);
    }
}

export class ProgramNameConflictException extends ConflictError {
    constructor(name: string) {
        super(`Program with name ${name} already exists`);
    }
}

export class ProgramCreateException extends InternalServerError {
    constructor() {
        super(`Error creating program`);
    }
}

export class ProgramDeleteException extends InternalServerError {
    constructor(code: string) {
        super(`Error deleting program with code ${code}`);
    }
}
