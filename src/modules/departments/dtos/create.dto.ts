import { IsNotEmpty, IsString } from 'class-validator';

export class DepartmentCreateDTO {
    @IsString()
    @IsNotEmpty()
    name: string;
}
