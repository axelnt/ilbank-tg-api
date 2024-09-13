import { IsNotEmpty, IsString } from 'class-validator';

export class ProgramDeleteDTO {
    @IsString()
    @IsNotEmpty()
    code: string;
}
