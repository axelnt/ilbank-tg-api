import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
