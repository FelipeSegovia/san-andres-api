import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Student } from "./student.entity";

@Table({ tableName: "parents", timestamps: true, paranoid: false })
export class Parent extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare studentId: string;

  @Column({
    type: DataType.ENUM("MADRE", "PADRE"),
    allowNull: false,
  })
  declare parentType: "MADRE" | "PADRE";

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
    allowNull: true,
  })
  declare rut: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare nationality: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare occupation: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare educationLevel: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare workplace: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare email: string;

  @BelongsTo(() => Student, {
    foreignKey: "studentId",
    targetKey: "id",
  })
  declare student: Student;
}
