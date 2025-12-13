import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { RolesModule } from '../roles/roles.module';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  imports: [SequelizeModule.forFeature([User]), RolesModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
