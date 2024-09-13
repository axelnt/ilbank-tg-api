import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseHealthDTO {
    @IsString()
    @IsNotEmpty()
    status: boolean;
}
