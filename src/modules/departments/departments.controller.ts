import { AuthGuard } from '@auth/auth.guard';
import { DepartmentCreateDTO } from '@modules/departments/dtos/create.dto';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) {}

    @Post('/')
    @UseGuards(AuthGuard)
    async createDepartment(@Body() departmentCreateDTO: DepartmentCreateDTO) {
        return this.departmentsService.create(departmentCreateDTO);
    }

    @Get('/')
    async getDepartments() {
        return this.departmentsService.findAll();
    }

    @Get('/:uuid')
    async getDepartment(@Param('uuid') uuid: string) {
        return this.departmentsService.findOne(uuid);
    }
}
