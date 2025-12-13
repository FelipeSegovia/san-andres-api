import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './common/environment.validation';
import { UserModule } from './features/user/user.module';
import { DatabaseModule } from './common/db/database.module';
import { AuthModule } from './features/auth/auth.module';
import { RolesModule } from './features/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
