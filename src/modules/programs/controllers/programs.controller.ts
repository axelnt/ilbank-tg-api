import { AuthGuard } from '@auth/auth.guard';
import { ProgramCreateDTO } from '@modules/programs/dtos/create.dto';
import { ProgramGetByCodeDTO } from '@modules/programs/dtos/get-by-code.dto';
import { ResponseProgramCreateDTO } from '@modules/programs/dtos/response-program-create.dto';
import { ResponseProgramDeleteDTO } from '@modules/programs/dtos/response-program-delete.dto';
import { ResponseProgramDTO } from '@modules/programs/dtos/response-program.dto';
import { ProgramsService } from '@modules/programs/programs.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Controller('programs')
export class ProgramsController {
    constructor(private readonly programsService: ProgramsService) {}

    @Post('/')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public',
                filename: (req, file, cb) => {
                    const extension = extname(file.originalname);
                    cb(null, `${Date.now()}-${uuid()}${extension}`);
                },
            }),
        }),
    )
    async createProgram(
        @Body() programCreateDTO: ProgramCreateDTO,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<ResponseProgramCreateDTO> {
        await this.programsService.create(programCreateDTO, file);
        return new ResponseProgramCreateDTO();
    }

    @Get('/')
    async getPrograms(): Promise<ResponseProgramDTO[]> {
        const programs = await this.programsService.findAll();
        return ResponseProgramDTO.toDTO(programs);
    }

    @Get('/:code')
    async getProgramByCode(@Param() programGetByCodeDTO: ProgramGetByCodeDTO) {
        const program = await this.programsService.findOne(
            programGetByCodeDTO.code,
        );
        return ResponseProgramDTO.toDTO(program);
    }

    @Delete('/:code')
    @UseGuards(AuthGuard)
    async deleteProgram(
        @Param() programGetByCodeDTO: ProgramGetByCodeDTO,
    ): Promise<ResponseProgramDeleteDTO> {
        await this.programsService.delete(programGetByCodeDTO.code);
        return new ResponseProgramDeleteDTO();
    }
}
