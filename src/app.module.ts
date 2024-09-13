import { AuthModule } from '@modules/auth/auth.module';
import { HealthModule } from '@modules/health/health.module';
import { ProgramsModule } from '@modules/programs/programs.module';
import { SeederModule } from '@modules/seeder/seeder.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@users/users.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { ConfigurationService } from './modules/configuration/configuration.service';

@Module({
    imports: [
        ConfigurationModule, // Import ConfigurationModule
        PassportModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: async (configService: ConfigurationService) => ({
                type: configService.database.type as any,
                host: configService.database.host,
                port: configService.database.port,
                username: configService.database.username,
                password: configService.database.password,
                database: configService.database.database,
                entities: [],
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        JwtModule.registerAsync({
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: async (configService: ConfigurationService) => ({
                secret: configService.jwt.secret,
                signOptions: { expiresIn: configService.jwt.expiresIn },
            }),
        }),
        AuthModule,
        HealthModule,
        ProgramsModule,
        UsersModule,
        SeederModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
