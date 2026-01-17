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
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
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
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    @InjectPinoLogger(EnrollmentsController.name)
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(EnrollmentsController.name);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto
  ): Promise<Enrollment> {
    const { student, academicYear } = createEnrollmentDto;
    this.logger.info(
      { studentName: student.names, academicYear },
      "enrollments:create request"
    );
    try {
      const enrollment = await this.enrollmentsService.create(
        createEnrollmentDto
      );
      this.logger.info(
        {
          enrollmentId: enrollment.id,
          enrollmentNumber: enrollment.enrollmentNumber,
        },
        "enrollments:create success"
      );
      return enrollment;
    } catch (error) {
      this.logger.error(
        {
          studentName: student.names,
          error: error instanceof Error ? error.message : String(error),
        },
        "enrollments:create failed"
      );
      throw error;
    }
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async findAll(): Promise<Enrollment[]> {
    this.logger.info({}, "enrollments:getAll request");
    try {
      const enrollments = await this.enrollmentsService.findAll();
      this.logger.info(
        { count: enrollments.length },
        "enrollments:getAll success"
      );
      return enrollments;
    } catch (error) {
      this.logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        "enrollments:getAll failed"
      );
      throw error;
    }
  }

  @Get(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async findOne(@Param("id") id: string): Promise<Enrollment> {
    this.logger.info({ enrollmentId: id }, "enrollments:getById request");
    try {
      const enrollment = await this.enrollmentsService.findOne(id);
      this.logger.info(
        { enrollmentId: id, enrollmentNumber: enrollment.enrollmentNumber },
        "enrollments:getById success"
      );
      return enrollment;
    } catch (error) {
      this.logger.error(
        {
          enrollmentId: id,
          error: error instanceof Error ? error.message : String(error),
        },
        "enrollments:getById failed"
      );
      throw error;
    }
  }

  @Get("number/:enrollmentNumber")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin", "User")
  @ApiBearerAuth()
  async findByEnrollmentNumber(
    @Param("enrollmentNumber") enrollmentNumber: string
  ): Promise<Enrollment> {
    this.logger.info({ enrollmentNumber }, "enrollments:getByNumber request");
    try {
      const enrollment = await this.enrollmentsService.findByEnrollmentNumber(
        enrollmentNumber
      );
      this.logger.info(
        { enrollmentId: enrollment.id, enrollmentNumber },
        "enrollments:getByNumber success"
      );
      return enrollment;
    } catch (error) {
      this.logger.error(
        {
          enrollmentNumber,
          error: error instanceof Error ? error.message : String(error),
        },
        "enrollments:getByNumber failed"
      );
      throw error;
    }
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin")
  @ApiBearerAuth()
  async update(
    @Param("id") id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto
  ): Promise<Enrollment> {
    this.logger.info({ enrollmentId: id }, "enrollments:update request");
    try {
      const enrollment = await this.enrollmentsService.update(
        id,
        updateEnrollmentDto
      );
      this.logger.info(
        { enrollmentId: id, enrollmentNumber: enrollment.enrollmentNumber },
        "enrollments:update success"
      );
      return enrollment;
    } catch (error) {
      this.logger.error(
        {
          enrollmentId: id,
          error: error instanceof Error ? error.message : String(error),
        },
        "enrollments:update failed"
      );
      throw error;
    }
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("Admin")
  @ApiBearerAuth()
  async remove(@Param("id") id: string): Promise<void> {
    this.logger.info({ enrollmentId: id }, "enrollments:delete request");
    try {
      await this.enrollmentsService.remove(id);
      this.logger.info({ enrollmentId: id }, "enrollments:delete success");
    } catch (error) {
      this.logger.error(
        {
          enrollmentId: id,
          error: error instanceof Error ? error.message : String(error),
        },
        "enrollments:delete failed"
      );
      throw error;
    }
  }
}
