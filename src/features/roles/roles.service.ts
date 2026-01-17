import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { Role } from "./entity/role.entity";
import { InjectModel } from "@nestjs/sequelize";
import { CreateRoleDto } from "./dtos/create-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleModel: typeof Role,
    @InjectPinoLogger(RolesService.name) private readonly logger: PinoLogger
  ) {
    this.logger.setContext(RolesService.name);
  }

  async createRole(newRole: CreateRoleDto): Promise<Role> {
    const { name } = newRole;
    this.logger.info({ name }, "roles:create service request");
    try {
      const role = await this.roleModel.create({
        ...newRole,
      });
      this.logger.info(
        { roleId: role.id, name: role.name },
        "roles:create success"
      );
      return role;
    } catch (error) {
      this.logger.error(
        { name, error: error instanceof Error ? error.message : String(error) },
        "roles:create failed"
      );
      throw error;
    }
  }

  async getAllRoles(): Promise<Role[]> {
    this.logger.info({}, "roles:getAll service request");
    try {
      const roles = await this.roleModel.findAll();
      this.logger.info({ count: roles.length }, "roles:getAll success");
      return roles;
    } catch (error) {
      this.logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        "roles:getAll failed"
      );
      throw error;
    }
  }

  async getRoleByName(name: string): Promise<Role | null> {
    this.logger.debug({ name }, "roles:getByName service request");
    try {
      const role = await this.roleModel.findOne({ where: { name } });
      if (!role) {
        this.logger.debug({ name }, "roles:getByName not found");
      } else {
        this.logger.debug(
          { roleId: role.id, name: role.name },
          "roles:getByName success"
        );
      }
      return role;
    } catch (error) {
      this.logger.error(
        { name, error: error instanceof Error ? error.message : String(error) },
        "roles:getByName failed"
      );
      throw error;
    }
  }

  async getRoleById(id: string): Promise<Role | null> {
    this.logger.debug({ roleId: id }, "roles:getById service request");
    try {
      const role = await this.roleModel.findByPk(id);
      if (!role) {
        this.logger.debug({ roleId: id }, "roles:getById not found");
      } else {
        this.logger.debug(
          { roleId: id, name: role.name },
          "roles:getById success"
        );
      }
      return role;
    } catch (error) {
      this.logger.error(
        {
          roleId: id,
          error: error instanceof Error ? error.message : String(error),
        },
        "roles:getById failed"
      );
      throw error;
    }
  }
}
