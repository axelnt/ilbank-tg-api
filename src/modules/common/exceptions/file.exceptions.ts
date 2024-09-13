import { NotFoundError } from '@common/interfaces/error.interface';

export class FileNotFoundException extends NotFoundError {
    constructor(error?: string) {
        super(error || 'File not found');
    }
}
