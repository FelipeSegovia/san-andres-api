import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
    private readonly sequelize: Sequelize
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
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

      return await this.findOne(enrollment.id);
    } catch (error) {
      await transaction.rollback();

      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof UniqueConstraintError) {
        throw new ConflictException("Ya existe una matrícula con estos datos");
      }

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException("Error al crear la matrícula");
    }
  }

  async findAll(): Promise<Enrollment[]> {
    return await this.enrollmentModel.findAll({
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
  }

  async findOne(idOrNumber: string): Promise<Enrollment> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrNumber
      );

    let enrollment: Enrollment | null;

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
      throw new NotFoundException(
        `Matrícula con id o número ${idOrNumber} no encontrada`
      );
    }

    return enrollment;
  }

  async findByEnrollmentNumber(enrollmentNumber: string): Promise<Enrollment> {
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
      throw new NotFoundException(
        `Matrícula con número ${enrollmentNumber} no encontrada`
      );
    }

    return enrollment;
  }

  async update(
    idOrNumber: string,
    updateEnrollmentDto: UpdateEnrollmentDto
  ): Promise<Enrollment> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrNumber
      );

    let enrollment: Enrollment | null;

    if (isUUID) {
      enrollment = await this.enrollmentModel.findByPk(idOrNumber);
    } else {
      enrollment = await this.enrollmentModel.findOne({
        where: { enrollmentNumber: idOrNumber },
      });
    }

    if (!enrollment) {
      throw new NotFoundException(
        `Matrícula con id o número ${idOrNumber} no encontrada`
      );
    }

    try {
      const { enrollmentDate, ...restUpdateData } = updateEnrollmentDto;
      const updateData: Partial<Enrollment> = { ...restUpdateData };

      if (enrollmentDate) {
        updateData.enrollmentDate = new Date(enrollmentDate);
      }

      await enrollment.update(updateData);

      return await this.findOne(idOrNumber);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException("Ya existe una matrícula con estos datos");
      }

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException("Error al actualizar la matrícula");
    }
  }

  async remove(idOrNumber: string): Promise<void> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrNumber
      );

    let enrollment: Enrollment | null;

    if (isUUID) {
      enrollment = await this.enrollmentModel.findByPk(idOrNumber);
    } else {
      enrollment = await this.enrollmentModel.findOne({
        where: { enrollmentNumber: idOrNumber },
      });
    }

    if (!enrollment) {
      throw new NotFoundException(
        `Matrícula con id o número ${idOrNumber} no encontrada`
      );
    }

    await enrollment.destroy();
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
