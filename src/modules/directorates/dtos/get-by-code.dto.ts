import { IsNotEmpty, IsString } from 'class-validator';

export class DirectorateGetByIdDTO {
    @IsString()
    @IsNotEmpty()
    uuid: string;
}
