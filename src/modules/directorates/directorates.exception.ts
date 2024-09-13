import {
    ConflictError,
    InternalServerError,
    NotFoundError,
} from '@common/interfaces/error.interface';

export class DirectoratesNotFoundException extends NotFoundError {
    constructor() {
        super('Directorates not found');
    }
}

export class DirectorateNotFoundException extends NotFoundError {
    constructor(uuid: string) {
        super(`Directorate with id ${uuid} not found`);
    }
}

export class DirectorateNameConflictException extends ConflictError {
    constructor(name: string) {
        super(`Directorate with name ${name} already exists`);
    }
}

export class DirectorateHasChildrenException extends ConflictError {
    constructor() {
        super('Directorate has children. Delete them first');
    }
}

export class DirectorateParentNotFoundException extends NotFoundError {
    constructor(uuid: string) {
        super(`Parent directorate with id ${uuid} not found`);
    }
}
export class DirectorateDeleteException extends InternalServerError {
    constructor(uuid: string) {
        super(`Error deleting directorate with uuid ${uuid}`);
    }
}

export class DirectorateCreateException extends InternalServerError {
    constructor() {
        super(`Error creating directorate`);
    }
}
