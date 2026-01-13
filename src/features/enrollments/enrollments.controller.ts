import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EnrollmentsService } from "./enrollments.service";
import { CreateEnrollmentDto } from "./dtos/create-enrollment.dto";
import { UpdateEnrollmentDto } from "./dtos/update-enrollment.dto";
import { Enrollment } from "./entity/enrollment.entity";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { RolesGuard } from "../../guards/roles/roles.guard";
import { Roles } from "../../decorators/roles.decorator";

@ApiTags("Enrollments")
@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto
  ): Promise<Enrollment> {
    return await this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async findAll(): Promise<Enrollment[]> {
    return await this.enrollmentsService.findAll();
  }

  @Get(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async findOne(@Param("id") id: string): Promise<Enrollment> {
    return await this.enrollmentsService.findOne(id);
  }

  @Get("number/:enrollmentNumber")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async findByEnrollmentNumber(
    @Param("enrollmentNumber") enrollmentNumber: string
  ): Promise<Enrollment> {
    return await this.enrollmentsService.findByEnrollmentNumber(
      enrollmentNumber
    );
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin")
  @ApiBearerAuth()
  async update(
    @Param("id") id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto
  ): Promise<Enrollment> {
    return await this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin")
  @ApiBearerAuth()
  async remove(@Param("id") id: string): Promise<void> {
    return await this.enrollmentsService.remove(id);
  }
}
