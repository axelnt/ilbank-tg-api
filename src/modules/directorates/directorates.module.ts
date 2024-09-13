import { Directorate } from '@common/entities/directorate.entity';
import { ConfigurationService } from '@modules/configuration/configuration.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectoratesController } from './directorates.controller';
import { DirectoratesService } from './directorates.service';

@Module({
    imports: [TypeOrmModule.forFeature([Directorate]), JwtModule],
    providers: [DirectoratesService, ConfigurationService],
    controllers: [DirectoratesController],
    exports: [DirectoratesService],
})
export class DirectoratesModule {}
