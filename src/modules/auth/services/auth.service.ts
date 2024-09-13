import { UsersService } from '@modules/users/services/users.service';
import { Injectable } from '@nestjs/common';
import { AuthLoginDTO } from '../dtos/login.dto';
import { AuthResponseLoginDTO } from '../dtos/response-login.dto';
import { EncryptionService } from './encryption.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly tokenService: TokenService,
    ) {}

    async login(loginDto: AuthLoginDTO): Promise<AuthResponseLoginDTO> {
        const { username, password } = loginDto;

        const existingUser = await this.userService.getUserPassword(username);

        if (
            !existingUser ||
            !(await this.validatePassword(password, existingUser.password))
        ) {
            throw new Error('Invalid username or password');
        }

        const token = this.tokenService.generateToken({
            uuid: existingUser.uuid,
            username: existingUser.username,
        });

        return { token };
    }

    private async validatePassword(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return await this.encryptionService.compare(password, hash);
    }
}
