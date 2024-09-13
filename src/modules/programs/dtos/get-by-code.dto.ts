import { IsNotEmpty, IsString } from 'class-validator';

export class ProgramGetByCodeDTO {
    @IsString()
    @IsNotEmpty()
    code: string;
}
