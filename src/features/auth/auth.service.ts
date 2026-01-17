import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { UserService } from "../user/user.service";
import { SigninDto } from "./dtos/signin.dto";
import { CreateUserDto } from "../user/dtos/create-user.dto";
import { AccessToken } from "./interfaces/access-token";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { RolesService } from "../roles/roles.service";
import { User } from "../user/entity/user.entity";
import { Role } from "../roles/entity/role.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RolesService,
    private readonly jwtService: JwtService,
    @InjectPinoLogger(AuthService.name) private readonly logger: PinoLogger
  ) {
    this.logger.setContext(AuthService.name);
  }

  async signIn({ email, password: pass }: SigninDto): Promise<AccessToken> {
    this.logger.info({ email }, "auth:signIn service request");
    try {
      const user = (
        await this.userService.findOneByEmail(email)
      )?.toJSON() as User;

      if (!user) {
        this.logger.warn({ email }, "auth:signIn user not found");
        throw new NotFoundException();
      }

      const isPasswordValid = await bcrypt.compare(pass, user.password);

      if (!isPasswordValid) {
        this.logger.warn({ email }, "auth:signIn invalid password");
        throw new UnauthorizedException();
      }

      const roleUser = (
        await this.roleService.getRoleById(user.roleId)
      )?.toJSON() as Role;

      const payload = {
        sub: user.id,
        username: user.firstName,
        email: user.email,
        role: roleUser?.name,
      };

      const accessToken = this.jwtService.sign(payload);
      this.logger.info({ email, userId: user.id }, "auth:signIn success");
      return {
        accessToken,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error(
        {
          email,
          error: error instanceof Error ? error.message : String(error),
        },
        "auth:signIn failed"
      );
      throw error;
    }
  }

  async signup(user: CreateUserDto): Promise<AccessToken> {
    const { email, firstName, lastName } = user;
    this.logger.info(
      { email, firstName, lastName },
      "auth:signup service request"
    );

    const userEncript = {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    };

    try {
      await this.userService.create(userEncript);
      this.logger.info({ email }, "auth:signup user created");
    } catch (error) {
      // Re-lanzar errores conocidos de NestJS directamente
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        this.logger.warn(
          { email, error: error.message },
          "auth:signup user creation failed"
        );
        throw error;
      }

      // Para cualquier otro error inesperado
      this.logger.error(
        {
          email,
          error: error instanceof Error ? error.message : String(error),
        },
        "auth:signup unexpected error"
      );
      throw new InternalServerErrorException("Error al registrar el usuario");
    }

    try {
      const result = await this.signIn({
        email: user.email,
        password: user.password,
      });
      this.logger.info({ email }, "auth:signup success");
      return result;
    } catch (error) {
      this.logger.error(
        {
          email,
          error: error instanceof Error ? error.message : String(error),
        },
        "auth:signup signIn failed"
      );
      throw error;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    this.logger.info({}, "auth:validateToken service request");
    try {
      const verifyToken = await this.jwtService.verify(token);
      const isValid = Object.keys(verifyToken).length > 0;
      this.logger.info({ valid: isValid }, "auth:validateToken success");
      return isValid;
    } catch (error) {
      this.logger.warn(
        { error: error instanceof Error ? error.message : String(error) },
        "auth:validateToken invalid token"
      );
      return false;
    }
  }
}
