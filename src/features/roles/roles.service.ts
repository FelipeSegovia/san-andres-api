import { Injectable } from '@nestjs/common';
import { Role } from './entity/role.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dtos/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private readonly roleModel: typeof Role) {
  }

  async createRole(newRole: CreateRoleDto): Promise<Role> {
    return this.roleModel.create({
      ...newRole,
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleModel.findAll();
  }

  async getRoleByName(name: string): Promise<Role | null> {
    return await this.roleModel.findOne({ where: { name } });
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.roleModel.findByPk(id);
  }
}
