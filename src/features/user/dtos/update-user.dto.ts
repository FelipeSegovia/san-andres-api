import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'firstName debe ser una cadena de texto' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'lastName debe ser una cadena de texto' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de email incorrecto' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'password debe ser una cadena de texto' })
  password?: string;

  @IsOptional()
  @IsUUID('4', { message: 'roleId debe ser un UUID válido' })
  roleId?: string;
}
