import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
    getHealth(): boolean {
        return true;
    }
}
