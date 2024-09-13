import { IsNotEmpty, IsString } from 'class-validator';

export class DepartmentGetByIdDTO {
    @IsString()
    @IsNotEmpty()
    uuid: string;
}
