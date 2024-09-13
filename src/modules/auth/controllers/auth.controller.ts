import { ResponseLoginDTO } from '@auth/dtos/response-login.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDTO } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() loginDto: AuthLoginDTO): Promise<ResponseLoginDTO> {
        const token = await this.authService.login(loginDto);
        return ResponseLoginDTO.toDTO(token);
    }
}
