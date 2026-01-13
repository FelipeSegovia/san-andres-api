import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollment } from './entity/enrollment.entity';
import { Student } from './entity/student.entity';
import { Parent } from './entity/parent.entity';
import { FamilyInformation } from './entity/family-information.entity';
import { AuthorizedPerson } from './entity/authorized-person.entity';
import { Representative } from './entity/representative.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Enrollment,
      Student,
      Parent,
      FamilyInformation,
      AuthorizedPerson,
      Representative,
    ]),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
