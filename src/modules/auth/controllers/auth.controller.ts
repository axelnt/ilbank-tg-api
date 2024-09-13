import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDTO } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() loginDto: AuthLoginDTO) {
        return await this.authService.login(loginDto);
    }
}
