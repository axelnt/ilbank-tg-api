import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { DatabaseConfiguration } from './interfaces/database.interface';
import { DocumentDetails } from './interfaces/documentDetails.interface';
import { InitialAdminConfiguration } from './interfaces/initial-admin.interface';
import { JWTConfiguration } from './interfaces/jwt.interface';

/**
 * Service to manage and provide configuration values for the application.
 * It combines values from a static configuration file and environment variables.
 */
@Injectable()
export class ConfigurationService {
    constructor(private configService: ConfigService) {}

    /**
     * Get the version of the application. The version is read from the static configuration file.
     * If the version is not set in the configuration, it defaults to 'v1'.
     * @returns {string} The application version, prefixed with 'v'.     */
    get version(): string {
        return 'v' + (configuration.version || '1');
    }

    /**
     * Get the port the application should listen on. The port is read from the static configuration file.
     * If the port is not set in the configuration, it defaults to 3000.
     * @returns {number} The port the application should listen on.
     */
    get port(): number {
        return configuration.port || 3000;
    }

    /**
     * Get the details of the document that describes the API. The details are read from the static configuration file.
     * If the details are not set in the configuration, it defaults to a placeholder document.
     * @returns {DocumentDetails} The details of the document that describes the API.
     * @see DocumentDetails
     */
    get documentDetails(): DocumentDetails {
        return (
            configuration.documentDetails || {
                title: 'Placeholder API',
                description: 'Placeholder API Documentation',
                version: '1',
                route: 'docs',
            }
        );
    }

    get database(): DatabaseConfiguration {
        return {
            type: this.configService.get('DATABASE_TYPE'),
            host: this.configService.get('DATABASE_HOST'),
            port: this.configService.get('DATABASE_PORT'),
            username: this.configService.get('DATABASE_USERNAME'),
            password: this.configService.get('DATABASE_PASSWORD'),
            database: this.configService.get('DATABASE_NAME'),
        };
    }

    get jwt(): JWTConfiguration {
        return {
            saltRounds: configuration.jwt.saltRounds,
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: configuration.jwt.expiresIn,
        };
    }

    get initialAdminInformation(): InitialAdminConfiguration {
        return {
            username: this.configService.get('ADMIN_USERNAME') || 'admin',
            password: this.configService.get('ADMIN_PASSWORD') || 'admin',
        };
    }
}
