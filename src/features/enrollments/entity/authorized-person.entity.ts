import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Student } from "./student.entity";

@Table({ tableName: "authorized_persons", timestamps: true, paranoid: false })
export class AuthorizedPerson extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare studentId: string;

  @Column({
    type: DataType.ENUM(
      "PADRE",
      "MADRE",
      "AMBOS",
      "ABUELOS MAT",
      "ABUELOS PAT",
      "OTROS"
    ),
    allowNull: true,
  })
  declare householdHead:
    | "PADRE"
    | "MADRE"
    | "AMBOS"
    | "ABUELOS MAT"
    | "ABUELOS PAT"
    | "OTROS";

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare householdHeadOther: string;

  @Column({
    type: DataType.ENUM(
      "Menos de $100.000",
      "Entre $100.000 y $200.000",
      "Entre $200.001 y $300.000",
      "Entre $300.001 y $400.000",
      "Entre $400.001 y $600.000",
      "Más de $600.000"
    ),
    allowNull: true,
  })
  declare monthlyIncome:
    | "Menos de $100.000"
    | "Entre $100.000 y $200.000"
    | "Entre $200.001 y $300.000"
    | "Entre $300.001 y $400.000"
    | "Entre $400.001 y $600.000"
    | "Más de $600.000";

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare socialProgramChileSolidario: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare socialProgramPuente: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare socialProgramSuf: boolean;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare socialProgramOther: string;

  @Column({
    type: DataType.ENUM("PROPIA", "ARRENDADA", "ALLEGADO"),
    allowNull: true,
  })
  declare housingType: "PROPIA" | "ARRENDADA" | "ALLEGADO";

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare housingStructure: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare hasDrinkingWater: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare hasElectricity: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare bedroomsCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare residentsCount: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare casIndex: string;

  @BelongsTo(() => Student, {
    foreignKey: "studentId",
    targetKey: "id",
  })
  declare student: Student;
}
