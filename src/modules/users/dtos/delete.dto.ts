import { IsNotEmpty, IsString } from 'class-validator';

export class UserDeleteDTO {
    @IsString()
    @IsNotEmpty()
    uuid: string;
}
