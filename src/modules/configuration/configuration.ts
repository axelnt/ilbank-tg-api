import { Configuration } from './interfaces/configuration.interface';

const configuration: Configuration = {
    version: '1',
    port: 3000,
    documentDetails: {
        title: 'NestJS API',
        description: 'NestJS API Documentation',
        version: '1',
        route: 'docs',
    },
    jwt: {
        saltRounds: 10,
        expiresIn: '1h',
    },
};

export default configuration;
