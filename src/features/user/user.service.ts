import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/entity/role.entity';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UserService {

  constructor(@InjectModel(User) private readonly userModel: typeof User, private readonly roleService: RolesService) {
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async create(newUser: CreateUserDto): Promise<User> {
    const role = (await this.roleService.getRoleByName('User'))?.toJSON() as Role;
    if (!role) {
      throw new NotFoundException(`Role User not found`);
    }

    try {
      const { firstName, lastName, password, email } = newUser;
      return await this.userModel.create({
        firstName,
        lastName,
        password,
        email,
        roleId: role.id,
      });

    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async update(userId: string, updateData: UpdateUserDto): Promise<User> {
    // Buscar el usuario
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    // Si se está actualizando el roleId, verificar que el rol existe
    if (updateData.roleId) {
      const role = await this.roleService.getRoleById(updateData.roleId);

      if (!role) {
        throw new NotFoundException(`Rol con id ${updateData.roleId} no encontrado`);
      }
    }

    try {
      // Actualizar solo los campos proporcionados
      await user.update(updateData);
      return user;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('Error al actualizar el usuario');
    }
  }

}
