import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entity/user.entity';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles/roles.guard';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { GetUserDto } from './dtos/get-user.dto';

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
    return await this.userService.create(newUser);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin', 'User')
  @ApiBearerAuth()
  async update(
    @Param('id') userId: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(userId, updateData);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('User', 'Admin')
  @ApiBearerAuth()
  async getUser(@Body() { email }: GetUserDto): Promise<User | null> {
    return await this.userService.findOneByEmail(email);
  }
}