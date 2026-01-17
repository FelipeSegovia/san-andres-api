import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { SigninDto } from "./dtos/signin.dto";
import { AccessToken } from "./interfaces/access-token";
import { CreateUserDto } from "../user/dtos/create-user.dto";
import { ValidateToken } from "./interfaces/validate-token";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectPinoLogger(AuthController.name) private readonly logger: PinoLogger
  ) {
    this.logger.setContext(AuthController.name);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() signInDto: SigninDto): Promise<AccessToken> {
    const { email } = signInDto;
    this.logger.info({ email }, "auth:signIn request");
    try {
      const result = await this.authService.signIn(signInDto);
      this.logger.info({ email }, "auth:signIn success");
      return result;
    } catch (error) {
      this.logger.warn(
        {
          email,
          error: error instanceof Error ? error.message : String(error),
        },
        "auth:signIn failed"
      );
      throw error;
    }
  }

  @Post("register")
  async signUp(@Body() user: CreateUserDto): Promise<AccessToken> {
    const { email, firstName, lastName } = user;
    this.logger.info({ email, firstName, lastName }, "auth:signUp request");
    try {
      const result = await this.authService.signup(user);
      this.logger.info({ email }, "auth:signUp success");
      return result;
    } catch (error) {
      this.logger.warn(
        {
          email,
          error: error instanceof Error ? error.message : String(error),
        },
        "auth:signUp failed"
      );
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get("validate")
  async validateToken(
    @Headers("authorization") authorization: string
  ): Promise<ValidateToken> {
    this.logger.info({}, "auth:validateToken request");
    if (!authorization) {
      this.logger.warn({}, "auth:validateToken no token provided");
      throw new UnauthorizedException("Token no proporcionado");
    }

    try {
      const token = authorization.replace("Bearer ", "");
      const validateToken = await this.authService.validateToken(token);
      this.logger.info({ valid: validateToken }, "auth:validateToken success");
      return { validateToken };
    } catch (error) {
      this.logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        "auth:validateToken failed"
      );
      throw error;
    }
  }
}
