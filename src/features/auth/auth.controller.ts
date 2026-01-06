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
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { SigninDto } from "./dtos/signin.dto";
import { AccessToken } from "./interfaces/access-token";
import { CreateUserDto } from "../user/dtos/create-user.dto";
import { ValidateToken } from "./interfaces/validate-token";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() signInDto: SigninDto): Promise<AccessToken> {
    return await this.authService.signIn(signInDto);
  }

  @Post("register")
  async signUp(@Body() user: CreateUserDto): Promise<AccessToken> {
    return await this.authService.signup(user);
  }

  @HttpCode(HttpStatus.OK)
  @Get("validate")
  async validateToken(
    @Headers("authorization") authorization: string
  ): Promise<ValidateToken> {
    if (!authorization) {
      throw new UnauthorizedException("Token no proporcionado");
    }

    const token = authorization.replace(/^Bearer\s+/i, "");
    const validateToken = await this.authService.validateToken(token);
    return { validateToken };
  }
}
