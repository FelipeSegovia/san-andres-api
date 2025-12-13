import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsString({ message: 'email debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'email no debe estar vacio' })
  @IsEmail({}, { message: 'Formato de email incorrecto' })
  email: string;

  @IsString({ message: 'password debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'password no debe estar vacio' })
  password: string;
}
