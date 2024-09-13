import { AuthGuard } from '@auth/auth.guard';
import { UserCreateDTO } from '@modules/users/dtos/create.dto';
import { UserDeleteDTO } from '@modules/users/dtos/delete.dto';
import { UsersService } from '@modules/users/services/users.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { UserGetByPublicIdDTO } from '@users/dtos/get-by-public-id.dto';
import { ResponseUserDTO } from '@users/dtos/response-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('/')
    async findAll(): Promise<ResponseUserDTO[]> {
        const users = await this.userService.findAll();
        return ResponseUserDTO.toDTO(users);
    }

    @UseGuards(AuthGuard)
    @Get('/:uuid')
    async findOne(
        @Param() userGetByPublicIdDTO: UserGetByPublicIdDTO,
    ): Promise<ResponseUserDTO> {
        const user = await this.userService.findOne(userGetByPublicIdDTO.uuid);
        return ResponseUserDTO.toDTO(user);
    }

    @UseGuards(AuthGuard)
    @Post('/')
    async create(@Body() userCreateDTO: UserCreateDTO): Promise<void> {
        await this.userService.create(userCreateDTO);
        return;
    }

    @UseGuards(AuthGuard)
    @Delete('/:uuid')
    async delete(@Param('uuid') userDeleteDTO: UserDeleteDTO) {
        await this.userService.delete(userDeleteDTO.uuid);
        return;
    }
}
