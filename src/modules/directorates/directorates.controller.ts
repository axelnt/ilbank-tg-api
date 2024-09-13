import { AuthGuard } from '@auth/auth.guard';
import { DirectorateCreateDTO } from '@modules/directorates/dtos/create.dto';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { DirectoratesService } from './directorates.service';
import { DirectorateDeleteDTO } from './dtos/delete.dto';
import { DirectorateGetByIdDTO } from './dtos/get-by-code.dto';

@Controller('directorates')
export class DirectoratesController {
    constructor(private readonly directoratesService: DirectoratesService) {}

    @Post('/')
    @UseGuards(AuthGuard)
    async createDirectorate(
        @Body() directorateCreateDTO: DirectorateCreateDTO,
    ) {
        return this.directoratesService.create(directorateCreateDTO);
    }

    @Get('/')
    async getDirectorates() {
        return this.directoratesService.findAll();
    }

    @Get('/:uuid')
    async getDirectorate(
        @Param() directorateGetByCodeDTO: DirectorateGetByIdDTO,
    ) {
        return this.directoratesService.findOne(directorateGetByCodeDTO.uuid);
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    async deleteDirectorate(
        @Param() directorateDeleteDTO: DirectorateDeleteDTO,
    ) {
        return this.directoratesService.delete(directorateDeleteDTO.uuid);
    }
}
