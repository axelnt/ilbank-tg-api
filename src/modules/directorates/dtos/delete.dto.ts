import { IsNotEmpty, IsString } from 'class-validator';

export class DirectorateDeleteDTO {
    @IsString()
    @IsNotEmpty()
    uuid: string;
}
