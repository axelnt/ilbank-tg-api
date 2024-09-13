import { User } from '@modules/common/entities/user.entity';
import { ConfigurationService } from '@modules/configuration/configuration.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, ConfigurationService, JwtService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
