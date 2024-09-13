import { Department } from '@common/entities/department.entity';
import { ConfigurationService } from '@modules/configuration/configuration.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

@Module({
    imports: [TypeOrmModule.forFeature([Department]), JwtModule],
    providers: [DepartmentsService, ConfigurationService],
    controllers: [DepartmentsController],
    exports: [DepartmentsService],
})
export class DepartmentsModule {}
