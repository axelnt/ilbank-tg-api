import { DocumentDetails } from './documentDetails.interface';
import { JWTBaseConfiguration } from './jwt.interface';

export interface Configuration {
    version: string;
    port: number;
    documentDetails: DocumentDetails;
    jwt: JWTBaseConfiguration;
}
