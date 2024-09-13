import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
