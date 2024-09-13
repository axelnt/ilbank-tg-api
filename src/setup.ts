import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AllExceptionsFilter } from './modules/common/interceptors/error.interceptor';
import { ResponseInterceptor } from './modules/common/interceptors/response.interceptor';
import { ConfigurationService } from './modules/configuration/configuration.service';

export function setup(app: INestApplication) {
    const configurationService = app.get(ConfigurationService);
    const version = configurationService.version;
    const documentDetails = configurationService.documentDetails;

    app.setGlobalPrefix(`api/${version}`);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
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

    return app;
}
