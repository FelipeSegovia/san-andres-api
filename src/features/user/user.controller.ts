import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entity/user.entity';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles/roles.guard';
import { AuthGuard } from '../../guards/auth/auth.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  @UseGuards(RolesGuard, AuthGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  async create(@Body() newUser: CreateUserDto): Promise<User> {
    // TODO: crear un usuario admin por defecto al iniciar la aplicacion
    return await this.userService.create(newUser);
  }
}