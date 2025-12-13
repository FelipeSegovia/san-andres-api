import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { configValidationSchema } from '../environment.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [__dirname + '/features/**/entities/*.entity{.ts}'],
        autoLoadModels: true,
        synchronize: false, // En producción siempre false, usa migraciones
        logging: false, // Cambiar a console.log para ver queries SQL
      }),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {
}
