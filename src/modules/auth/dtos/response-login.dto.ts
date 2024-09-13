import { IsNotEmpty, IsString } from 'class-validator';

export class AuthResponseLoginDTO {
    @IsString()
    @IsNotEmpty()
    token: string;
}
