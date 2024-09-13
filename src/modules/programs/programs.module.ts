import { Program } from '@common/entities/program.entity';
import { ConfigurationService } from '@modules/configuration/configuration.service';
import { DepartmentsModule } from '@modules/departments/departments.module';
import { DirectoratesModule } from '@modules/directorates/directorates.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Program]),
        DepartmentsModule,
        DirectoratesModule,
        JwtModule,
    ],
    providers: [ProgramsService, ConfigurationService],
    controllers: [ProgramsController],
    exports: [ProgramsService],
})
export class ProgramsModule {}
