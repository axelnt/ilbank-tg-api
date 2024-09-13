import { EncryptionService } from '@auth/services/encryption.service';
import { ConfigurationModule } from '@configuration/configuration.module';
import { User } from '@modules/common/entities/user.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigurationModule, JwtModule],
    providers: [UsersService, EncryptionService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
