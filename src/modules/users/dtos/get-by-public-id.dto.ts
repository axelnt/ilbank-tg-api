import { IsNotEmpty, IsString } from 'class-validator';

export class UserGetByPublicIdDTO {
    @IsString()
    @IsNotEmpty()
    uuid: string;
}
