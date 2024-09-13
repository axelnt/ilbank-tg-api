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
import { ResponseDirectorateDTO } from './dtos/response-directorate.dto';

@Controller('directorates')
export class DirectoratesController {
    constructor(private readonly directoratesService: DirectoratesService) {}

    @Get('/')
    async getDirectorates(): Promise<ResponseDirectorateDTO[]> {
        const directorates = await this.directoratesService.findAll();
        return ResponseDirectorateDTO.toDTO(directorates);
    }

    @Get('/:uuid')
    async getDirectorate(
        @Param() directorateGetByCodeDTO: DirectorateGetByIdDTO,
    ): Promise<ResponseDirectorateDTO> {
        const directorate = await this.directoratesService.findOne(
            directorateGetByCodeDTO.uuid,
        );
        return ResponseDirectorateDTO.toDTO(directorate);
    }

    @Post('/')
    @UseGuards(AuthGuard)
    async createDirectorate(
        @Body() directorateCreateDTO: DirectorateCreateDTO,
    ): Promise<void> {
        await this.directoratesService.create(directorateCreateDTO);
        return;
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    async deleteDirectorate(
        @Param() directorateDeleteDTO: DirectorateDeleteDTO,
    ): Promise<void> {
        await this.directoratesService.delete(directorateDeleteDTO.uuid);
        return;
    }
}
