export class NotFoundError extends Error {
    name: 'NotFoundError';
}

export class ConflictError extends Error {
    name: 'ConflictError';
}

export class InternalServerError extends Error {
    name: 'InternalServerErrror';
}

export class BadRequestError extends Error {
    name: 'BadRequestError';
}
