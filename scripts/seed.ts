import { AppModule } from '@/app.module';
import { SeedUserService } from '@modules/seeder/services/seed-user.service';
import { NestFactory } from '@nestjs/core';

async function seed() {
    const app = await NestFactory.create(AppModule);

    const seedUserService = app.get(SeedUserService);
    await seedUserService.seed();

    await app.close();
}

seed();
