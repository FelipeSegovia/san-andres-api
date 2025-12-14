import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configservice: ConfigService) => ({
        secret: configservice.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '12h' },
      }),
    }),
    UserModule,
    RolesModule,
  ],
})
export class AuthModule {
}
