import {
    ConflictError,
    NotFoundError,
} from '@common/interfaces/error.interface';

export class UsersNotFoundException extends NotFoundError {
    constructor() {
        super('Users not found');
    }
}

export class UserNotFoundException extends NotFoundError {
    constructor(uuid: string) {
        super(`User with id ${uuid} not found`);
    }
}

export class UserAlreadyExistsException extends ConflictError {
    constructor(username: string) {
        super(`User with username ${username} already exists`);
    }
}
