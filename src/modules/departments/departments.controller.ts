import { AuthGuard } from '@auth/auth.guard';
import { DepartmentCreateDTO } from '@modules/departments/dtos/create.dto';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { ResponseDepartmentDTO } from './dtos/response-department.dto';

@Controller('departments')
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) {}

    @Get('/')
    async getDepartments(): Promise<ResponseDepartmentDTO[]> {
        const departments = await this.departmentsService.findAll();
        return ResponseDepartmentDTO.toDTO(departments);
    }

    @Get('/:uuid')
    async getDepartment(
        @Param('uuid') uuid: string,
    ): Promise<ResponseDepartmentDTO> {
        const department = await this.departmentsService.findOne(uuid);
        return ResponseDepartmentDTO.toDTO(department);
    }

    @Post('/')
    @UseGuards(AuthGuard)
    async createDepartment(
        @Body() departmentCreateDTO: DepartmentCreateDTO,
    ): Promise<void> {
        await this.departmentsService.create(departmentCreateDTO);
        return;
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    async deleteDepartment(@Param('uuid') uuid: string): Promise<void> {
        await this.departmentsService.delete(uuid);
        return;
    }
}
