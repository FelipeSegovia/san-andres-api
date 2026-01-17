import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { RolesService } from "./roles.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { Role } from "./entity/role.entity";
import { RolesGuard } from "../../guards/roles/roles.guard";
import { Roles } from "../../decorators/roles.decorator";
import { AuthGuard } from "../../guards/auth/auth.guard";

@ApiTags("Roles")
@Controller("roles")
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    @InjectPinoLogger(RolesController.name) private readonly logger: PinoLogger
  ) {
    this.logger.setContext(RolesController.name);
  }

  @Post()
  @UseGuards(RolesGuard, AuthGuard)
  @Roles("Admin")
  @ApiBearerAuth()
  async create(@Body() newRole: CreateRoleDto): Promise<Role> {
    const { name, description } = newRole;
    this.logger.info({ name }, "roles:create request");
    try {
      const role = await this.rolesService.createRole(newRole);
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

  @Get()
  @UseGuards(RolesGuard, AuthGuard)
  @Roles("Admin")
  @ApiBearerAuth()
  async getAllRoles(): Promise<Role[]> {
    this.logger.info({}, "roles:getAll request");
    try {
      const roles = await this.rolesService.getAllRoles();
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

  @Get(":id")
  @UseGuards(RolesGuard, AuthGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async getRoleById(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<Role | null> {
    this.logger.info({ roleId: id }, "roles:getById request");
    try {
      const role = await this.rolesService.getRoleById(id);
      if (!role) {
        this.logger.warn({ roleId: id }, "roles:getById not found");
      } else {
        this.logger.info(
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
