import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async create(@Body() newRole: CreateRoleDto): Promise<Role> {
    // TODO: Crear registros de roles en las tablas
    return await this.rolesService.createRole(newRole);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  getAllRoles(): Promise<Role[]> {
    return this.rolesService.getAllRoles();
  }


}
