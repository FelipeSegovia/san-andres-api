import {
  BadRequestException,
  ConflictException,
  Injectable, InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SigninDto } from './dtos/signin.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AccessToken } from './interfaces/access-token';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService) {
  }

  async signIn({ email, password: pass }: SigninDto): Promise<AccessToken> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new NotFoundException();

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.firstName };

    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }


  async signup(user: CreateUserDto): Promise<AccessToken> {
    const userEncript = {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    };

    try {
      await this.userService.create(userEncript);
    } catch (error) {
      // Re-lanzar errores conocidos de NestJS directamente
      if (error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException) {
        throw error;
      }

      // Para cualquier otro error inesperado
      throw new InternalServerErrorException('Error al registrar el usuario');
    }

    return await this.signIn({
      email: user.email,
      password: user.password,
    });
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const verifyToken = await this.jwtService.verify(token);
      return Object.keys(verifyToken).length > 0;
    } catch {
      return false;
    }
  }

}
