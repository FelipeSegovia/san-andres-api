import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { User } from "./entity/user.entity";
import { Roles } from "../../decorators/roles.decorator";
import { RolesGuard } from "../../guards/roles/roles.guard";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { GetUserDtoResponse } from "./dtos/get-user-respose.dto";

@ApiTags("User")
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectPinoLogger(UserController.name) private readonly logger: PinoLogger
  ) {}

  @Post()
  @UseGuards(RolesGuard, AuthGuard)
  @Roles("Admin")
  @ApiBearerAuth()
  async create(@Body() newUser: CreateUserDto): Promise<User> {
    const { email, firstName, lastName } = newUser;
    this.logger.info({ email, firstName, lastName }, "users:create request");
    const user = await this.userService.create(newUser);
    this.logger.info(
      { userId: user.id, email: user.email },
      "users:create success"
    );
    return user;
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async update(
    @Param("id") userId: string,
    @Body() updateData: UpdateUserDto
  ): Promise<User> {
    const { email, roleId } = updateData;
    this.logger.info({ userId, email, roleId }, "users:update request");
    const updatedUser = await this.userService.update(userId, updateData);
    this.logger.info(
      { userId: updatedUser.id, email: updatedUser.email },
      "users:update success"
    );
    return updatedUser;
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("User", "Admin")
  @ApiBearerAuth()
  async getUser(
    @Query("email") email: string
  ): Promise<GetUserDtoResponse | null> {
    this.logger.info({ email }, "users:get request");
    const user = await this.userService.findOneByEmail(email);
    this.logger.info(
      { userId: user?.id, email: user?.email },
      "users:get success"
    );
    return user;
  }
}
