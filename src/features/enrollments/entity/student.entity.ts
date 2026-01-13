import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import { Parent } from "./parent.entity";
import { FamilyInformation } from "./family-information.entity";
import { AuthorizedPerson } from "./authorized-person.entity";
import { Representative } from "./representative.entity";
import { Enrollment } from "./enrollment.entity";

@Table({ tableName: "students", timestamps: true, paranoid: false })
export class Student extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare names: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare lastNames: string;

  @Column({
    type: DataType.STRING(12),
    allowNull: false,
    unique: true,
  })
  declare rut: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare birthDate: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare nationality: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare currentAddress: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare commune: string;

  @Column({
    type: DataType.ENUM("Masculino", "Femenino", "Otro"),
    allowNull: false,
  })
  declare gender: "Masculino" | "Femenino" | "Otro";

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare prevision: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare medicalConditions: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare allergies: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare medications: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare specialNeeds: string;

  @HasMany(() => Parent, {
    foreignKey: "studentId",
    sourceKey: "id",
  })
  declare parents: Parent[];

  @HasOne(() => FamilyInformation, {
    foreignKey: "studentId",
    sourceKey: "id",
  })
  declare familyInformation: FamilyInformation;

  @HasOne(() => AuthorizedPerson, {
    foreignKey: "studentId",
    sourceKey: "id",
  })
  declare authorizedPerson: AuthorizedPerson;

  @HasOne(() => Representative, {
    foreignKey: "studentId",
    sourceKey: "id",
  })
  declare representative: Representative;

  @HasMany(() => Enrollment, {
    foreignKey: "studentId",
    sourceKey: "id",
  })
  declare enrollments: Enrollment[];
}
