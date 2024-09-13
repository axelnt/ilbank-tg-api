export interface DatabaseConfiguration {
    type: string;
    host: string;
    port?: number;
    username: string;
    password: string;
    database: string;
}
