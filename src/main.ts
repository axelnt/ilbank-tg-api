import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './modules/configuration/configuration.service';
import { setup } from './setup';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        abortOnError: false,
        logger: ['error', 'warn', 'log'],
    });
    setup(app);

    const configurationService = app.get(ConfigurationService);
    const port = configurationService.port;

    await app.listen(port);
}
bootstrap();
