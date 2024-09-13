import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DirectorateCreateDTO {
    @IsString()
    @IsNotEmpty()
    name: string; // Name of the directorate

    @IsOptional()
    @IsString()
    parent: string; // UUID of the parent directorate (if any)
}
