import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { Enrollment } from "./entity/enrollment.entity";
import { Student } from "./entity/student.entity";
import { Parent } from "./entity/parent.entity";
import { FamilyInformation } from "./entity/family-information.entity";
import { AuthorizedPerson } from "./entity/authorized-person.entity";
import { Representative } from "./entity/representative.entity";
import { CreateEnrollmentDto } from "./dtos/create-enrollment.dto";
import { UpdateEnrollmentDto } from "./dtos/update-enrollment.dto";
import { Transaction, UniqueConstraintError } from "sequelize";

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment)
    private readonly enrollmentModel: typeof Enrollment,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Parent)
    private readonly parentModel: typeof Parent,
    @InjectModel(FamilyInformation)
    private readonly familyInformationModel: typeof FamilyInformation,
    @InjectModel(AuthorizedPerson)
    private readonly authorizedPersonModel: typeof AuthorizedPerson,
    @InjectModel(Representative)
    private readonly representativeModel: typeof Representative,
    private readonly sequelize: Sequelize,
    @InjectPinoLogger(EnrollmentsService.name)
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(EnrollmentsService.name);
  }

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const { student, academicYear } = createEnrollmentDto;
    this.logger.info(
      { studentName: student.names, academicYear },
      "enrollments:create service request"
    );
    const transaction = await this.sequelize.transaction();

    try {
      const {
        student,
        parents,
        familyInformation,
        authorizedPerson,
        representative,
        ...enrollmentData
      } = createEnrollmentDto;

      const existingStudent = await this.studentModel.findOne({
        where: { rut: student.rut },
        transaction,
      });

      if (existingStudent) {
        this.logger.warn(
          { studentRut: student.rut },
          "enrollments:create student already exists"
        );
        throw new ConflictException(
          `Ya existe un estudiante con el RUT ${student.rut}`
        );
      }

      const createdStudent = await this.studentModel.create(
        {
          ...student,
          birthDate: new Date(student.birthDate),
        },
        { transaction }
      );

      if (parents && parents.length > 0) {
        await Promise.all(
          parents.map((parent) =>
            this.parentModel.create(
              {
                ...parent,
                studentId: createdStudent.id,
              },
              { transaction }
            )
          )
        );
      }

      if (familyInformation) {
        await this.familyInformationModel.create(
          {
            ...familyInformation,
            studentId: createdStudent.id,
          },
          { transaction }
        );
      }

      if (authorizedPerson) {
        await this.authorizedPersonModel.create(
          {
            ...authorizedPerson,
            studentId: createdStudent.id,
          },
          { transaction }
        );
      }

      if (representative) {
        await this.representativeModel.create(
          {
            ...representative,
            studentId: createdStudent.id,
          },
          { transaction }
        );
      }

      const enrollmentNumber = await this.generateEnrollmentNumber(
        enrollmentData.academicYear,
        transaction
      );

      const enrollment = await this.enrollmentModel.create(
        {
          ...enrollmentData,
          enrollmentNumber,
          studentId: createdStudent.id,
          enrollmentDate: new Date(enrollmentData.enrollmentDate),
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.info(
        { enrollmentId: enrollment.id, enrollmentNumber },
        "enrollments:create success"
      );

      return await this.findOne(enrollment.id);
    } catch (error) {
      await transaction.rollback();

      if (error instanceof ConflictException) {
        this.logger.warn(
          { studentName: student.names, error: error.message },
          "enrollments:create conflict"
        );
        throw error;
      }

      if (error instanceof UniqueConstraintError) {
        this.logger.warn(
          { studentName: student.names },
          "enrollments:create unique constraint violation"
        );
        throw new ConflictException("Ya existe una matrícula con estos datos");
      }

      if (error instanceof Error) {
        this.logger.error(
          { studentName: student.names, error: error.message },
          "enrollments:create failed"
        );
        throw new BadRequestException(error.message);
      }

      this.logger.error(
        { studentName: student.names },
        "enrollments:create unexpected error"
      );
      throw new BadRequestException("Error al crear la matrícula");
    }
  }

  async findAll(): Promise<Enrollment[]> {
    this.logger.debug({}, "enrollments:findAll service request");
    try {
      const enrollments = await this.enrollmentModel.findAll({
        include: [
          {
            model: Student,
            include: [
              { model: Parent },
              { model: FamilyInformation },
              { model: AuthorizedPerson },
              { model: Representative },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      this.logger.debug(
        { count: enrollments.length },
        "enrollments:findAll success"
      );
      return enrollments;
    } catch (error) {
      this.logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        "enrollments:findAll failed"
      );
      throw error;
    }
  }

  async findOne(idOrNumber: string): Promise<Enrollment> {
    this.logger.debug(
      { identifier: idOrNumber },
      "enrollments:findOne service request"
    );
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrNumber
      );

    let enrollment: Enrollment | null;

    try {
      if (isUUID) {
        enrollment = await this.enrollmentModel.findByPk(idOrNumber, {
          include: [
            {
              model: Student,
              include: [
                { model: Parent },
                { model: FamilyInformation },
                { model: AuthorizedPerson },
                { model: Representative },
              ],
            },
          ],
        });
      } else {
        enrollment = await this.enrollmentModel.findOne({
          where: { enrollmentNumber: idOrNumber },
          include: [
            {
              model: Student,
              include: [
                { model: Parent },
                { model: FamilyInformation },
                { model: AuthorizedPerson },
                { model: Representative },
              ],
            },
          ],
        });
      }

      if (!enrollment) {
        this.logger.warn(
          { identifier: idOrNumber },
          "enrollments:findOne not found"
        );
        throw new NotFoundException(
          `Matrícula con id o número ${idOrNumber} no encontrada`
        );
      }

      this.logger.debug(
        { enrollmentId: enrollment.id },
        "enrollments:findOne success"
      );
      return enrollment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        {
          identifier: idOrNumber,
          error: error instanceof Error ? error.message : String(error),
        },
        "enrollments:findOne failed"
      );
      throw error;
    }
  }

  async findByEnrollmentNumber(enrollmentNumber: string): Promise<Enrollment> {
    this.logger.debug(
      { enrollmentNumber },
      "enrollments:findByEnrollmentNumber service request"
    );
    try {
      const enrollment = await this.enrollmentModel.findOne({
        where: { enrollmentNumber },
        include: [
          {
            model: Student,
            include: [
              { model: Parent },
              { model: FamilyInformation },
              { model: AuthorizedPerson },
              { model: Representative },
            ],
          },
        ],
      });

      if (!enrollment) {
        this.logger.warn(
          { enrollmentNumber },
          "enrollments:findByEnrollmentNumber not found"
        );
        throw new NotFoundException(
          `Matrícula con número ${enrollmentNumber} no encontrada`
        );
      }

      this.logger.debug(
        { enrollmentId: enrollment.id },
        "enrollments:findByEnrollmentNumber success"
      );
      return enrollment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        {
          enrollmentNumber,
          error: error instanceof Error ? error.message : String(error),
        },
        "enrollments:findByEnrollmentNumber failed"
      );
      throw error;
    }
  }

  async update(
    idOrNumber: string,
    updateEnrollmentDto: UpdateEnrollmentDto
  ): Promise<Enrollment> {
    this.logger.info(
      { identifier: idOrNumber },
      "enrollments:update service request"
    );
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrNumber
      );

    let enrollment: Enrollment | null;

    try {
      if (isUUID) {
        enrollment = await this.enrollmentModel.findByPk(idOrNumber);
      } else {
        enrollment = await this.enrollmentModel.findOne({
          where: { enrollmentNumber: idOrNumber },
        });
      }

      if (!enrollment) {
        this.logger.warn(
          { identifier: idOrNumber },
          "enrollments:update not found"
        );
        throw new NotFoundException(
          `Matrícula con id o número ${idOrNumber} no encontrada`
        );
      }

      const { enrollmentDate, ...restUpdateData } = updateEnrollmentDto;
      const updateData: Partial<Enrollment> = { ...restUpdateData };

      if (enrollmentDate) {
        updateData.enrollmentDate = new Date(enrollmentDate);
      }

      await enrollment.update(updateData);
      this.logger.info(
        { enrollmentId: enrollment.id },
        "enrollments:update success"
      );

      return await this.findOne(idOrNumber);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof UniqueConstraintError) {
        this.logger.warn(
          { identifier: idOrNumber },
          "enrollments:update unique constraint violation"
        );
        throw new ConflictException("Ya existe una matrícula con estos datos");
      }

      if (error instanceof Error) {
        this.logger.error(
          { identifier: idOrNumber, error: error.message },
          "enrollments:update failed"
        );
        throw new BadRequestException(error.message);
      }

      this.logger.error(
        { identifier: idOrNumber },
        "enrollments:update unexpected error"
      );
      throw new BadRequestException("Error al actualizar la matrícula");
    }
  }

  async remove(idOrNumber: string): Promise<void> {
    this.logger.info(
      { identifier: idOrNumber },
      "enrollments:delete service request"
    );
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrNumber
      );

    let enrollment: Enrollment | null;

    try {
      if (isUUID) {
        enrollment = await this.enrollmentModel.findByPk(idOrNumber);
      } else {
        enrollment = await this.enrollmentModel.findOne({
          where: { enrollmentNumber: idOrNumber },
        });
      }

      if (!enrollment) {
        this.logger.warn(
          { identifier: idOrNumber },
          "enrollments:delete not found"
        );
        throw new NotFoundException(
          `Matrícula con id o número ${idOrNumber} no encontrada`
        );
      }

      await enrollment.destroy();
      this.logger.info(
        { enrollmentId: enrollment.id },
        "enrollments:delete success"
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        {
          identifier: idOrNumber,
          error: error instanceof Error ? error.message : String(error),
        },
        "enrollments:delete failed"
      );
      throw error;
    }
  }

  private async generateEnrollmentNumber(
    academicYear: number,
    transaction: Transaction
  ): Promise<string> {
    const yearPrefix = academicYear.toString().slice(-2);
    const count = await this.enrollmentModel.count({
      where: {
        academicYear,
      },
      transaction,
    });

    const sequence = (count + 1).toString().padStart(4, "0");
    return `MAT-${yearPrefix}-${sequence}`;
  }
}
