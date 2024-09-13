import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './modules/common/interceptors/error.interceptor';
import { ResponseInterceptor } from './modules/common/interceptors/response.interceptor';
import { ConfigurationService } from './modules/configuration/configuration.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        abortOnError: false,
        logger: ['error', 'warn', 'log'],
    });

    const configurationService = app.get(ConfigurationService);
    const version = configurationService.version;
    const port = configurationService.port;
    const documentDetails = configurationService.documentDetails;

    app.setGlobalPrefix(`api/${version}`);

    app.useGlobalPipes(new ValidationPipe({ transform: true, always: true }));
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    ); // For removing unwanted fields from the response
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '20gb' }));

    const documentConfig = new DocumentBuilder()
        .setTitle(documentDetails.title)
        .setDescription(documentDetails.description)
        .addBearerAuth()
        .setVersion(documentDetails.version)
        .build();

    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup(
        `api/${version}/${documentDetails.route}`,
        app,
        document,
    );

    await app.listen(port);
}
bootstrap();
