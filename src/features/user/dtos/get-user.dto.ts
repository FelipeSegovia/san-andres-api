import { IsEmail } from 'class-validator';

export class GetUserDto {
  @IsEmail({}, { message: 'Formato de email incorrecto' })
  email: string;
}