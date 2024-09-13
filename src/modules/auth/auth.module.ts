import { User } from '@common/entities/user.entity';
import { ConfigurationService } from '@configuration/configuration.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { EncryptionService } from '@auth/services/encryption.service';
import { TokenService } from '@auth/services/token.service';
import { UsersModule } from '@users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule, UsersModule],
    providers: [
        AuthService,
        EncryptionService,
        TokenService,
        ConfigurationService,
    ],
    controllers: [AuthController],
    exports: [EncryptionService],
})
export class AuthModule {}
