import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { User } from "./entity/user.entity";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { RolesService } from "../roles/roles.service";
import { Role } from "../roles/entity/role.entity";
import { UniqueConstraintError } from "sequelize";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly roleService: RolesService,
    @InjectPinoLogger(UserService.name) private readonly logger: PinoLogger
  ) {
    this.logger.setContext(UserService.name);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    this.logger.info({ email }, "users:findOneByEmail request");
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      this.logger.warn({ email }, "users:findOneByEmail not found");
      throw new NotFoundException(`User with email ${email} not found`);
    }

    this.logger.info(
      { userId: user.id, email: user.email },
      "users:findOneByEmail success"
    );
    return user;
  }

  async create(newUser: CreateUserDto): Promise<User> {
    const role = (
      await this.roleService.getRoleByName("User")
    )?.toJSON() as Role;
    if (!role) {
      throw new NotFoundException(`Role User not found`);
    }

    try {
      const { firstName, lastName, email } = newUser;
      this.logger.info(
        { email, firstName, lastName },
        "users:create payload received"
      );
      const createdUser = await this.userModel.create({
        firstName,
        lastName,
        password: newUser.password,
        email,
        roleId: role.id,
      });
      this.logger.info(
        { userId: createdUser.id, email: createdUser.email },
        "users:create success"
      );
      return createdUser;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        this.logger.warn(
          { email: newUser.email },
          "users:create email already exists"
        );
        throw new ConflictException("El correo electrónico ya está registrado");
      }

      if (error instanceof Error) {
        this.logger.error(
          { err: error, email: newUser.email },
          "users:create failed"
        );
        throw new BadRequestException(error.message);
      }

      this.logger.error(
        { email: newUser.email },
        "users:create unexpected error"
      );
      throw new BadRequestException("Error al crear el usuario");
    }
  }

  async update(userId: string, updateData: UpdateUserDto): Promise<User> {
    this.logger.info(
      { userId, email: updateData.email, roleId: updateData.roleId },
      "users:update payload received"
    );
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      this.logger.warn({ userId }, "users:update user not found");
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    if (updateData.roleId) {
      const role = await this.roleService.getRoleById(updateData.roleId);

      if (!role) {
        this.logger.warn(
          { userId, roleId: updateData.roleId },
          "users:update role not found"
        );
        throw new NotFoundException(
          `Rol con id ${updateData.roleId} no encontrado`
        );
      }
    }

    try {
      await user.update(updateData);
      this.logger.info(
        { userId: user.id, email: user.email },
        "users:update success"
      );
      return user;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        this.logger.warn(
          { userId, email: updateData.email },
          "users:update email already exists"
        );
        throw new ConflictException("El correo electrónico ya está registrado");
      }

      if (error instanceof Error) {
        this.logger.error({ err: error, userId }, "users:update failed");
        throw new BadRequestException(error.message);
      }

      this.logger.error({ userId }, "users:update unexpected error");
      throw new BadRequestException("Error al actualizar el usuario");
    }
  }
}
