import { IsNotEmpty, IsString } from 'class-validator';

export class DepartmentsDeleteDTO {
    @IsString()
    @IsNotEmpty()
    uuid: string;
}
