import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ProgramCreateDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        return typeof value === 'string' ? JSON.parse(value) : value;
    })
    departments: string[]; // UUIDs of departments

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        return typeof value === 'string' ? JSON.parse(value) : value;
    })
    directorates: string[]; // UUIDs of directorates

    @IsBoolean()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return Boolean(value);
    })
    processBased: boolean;

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        return typeof value === 'string' ? JSON.parse(value) : value;
    })
    users: string[];
}
