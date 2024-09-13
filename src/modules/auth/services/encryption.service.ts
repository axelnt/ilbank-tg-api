import { ConfigurationService } from '@modules/configuration/configuration.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
    constructor(private readonly configurationService: ConfigurationService) {}

    async hash(data: string): Promise<string> {
        return bcrypt.hash(data, this.configurationService.jwt.saltRounds);
    }

    async compare(data: string, hash: string): Promise<boolean> {
        return bcrypt.compare(data, hash);
    }
}
