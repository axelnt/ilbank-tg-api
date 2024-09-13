import { ConfigurationService } from '@modules/configuration/configuration.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private configurationService: ConfigurationService,
    ) {}

    generateToken(payload: JwtPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.configurationService.jwt.secret,
            expiresIn: this.configurationService.jwt.expiresIn,
        });
    }
}
