import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dtos/create-role.dto';
import { Role } from './entity/role.entity';
import { RolesGuard } from '../../guards/roles/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth/auth.guard';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {
  }

  @Post()
  @UseGuards(RolesGuard, AuthGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  async create(@Body() newRole: CreateRoleDto): Promise<Role> {
    return await this.rolesService.createRole(newRole);
  }

  @Get()
  @UseGuards(RolesGuard, AuthGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  getAllRoles(): Promise<Role[]> {
    return this.rolesService.getAllRoles();
  }

  @Get(':id')
  @UseGuards(RolesGuard, AuthGuard)
  @Roles('Admin', 'User')
  @ApiBearerAuth()
  async getRoleById(@Param('id', ParseUUIDPipe) id: string): Promise<Role | null> {
    return await this.rolesService.getRoleById(id);
  }

}
