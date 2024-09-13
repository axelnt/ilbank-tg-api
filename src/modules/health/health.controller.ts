import { Controller, Get } from '@nestjs/common';
import { ResponseHealthDTO } from './dto/health.dto';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    getHealth(): ResponseHealthDTO {
        const health: ResponseHealthDTO = {
            status: this.healthService.getHealth(),
        };

        return health;
    }
}
