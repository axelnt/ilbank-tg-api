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

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('/')
    async findAll() {
        return await this.userService.findAll();
    }

    @UseGuards(AuthGuard)
    @Post('/')
    async create(@Body() userCreateDTO: UserCreateDTO) {
        return await this.userService.create(userCreateDTO);
    }

    @UseGuards(AuthGuard)
    @Delete('/:uuid')
    async delete(@Param('uuid') userDeleteDTO: UserDeleteDTO) {
        return await this.userService.delete(userDeleteDTO);
    }
}
