import { User } from '@modules/common/entities/user.entity';
import { ConfigurationService } from '@modules/configuration/configuration.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';
import { SeedUserService } from './services/seed-user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule],
    providers: [ConfigurationService, SeedUserService],
    controllers: [],
    exports: [],
})
export class SeederModule {}
