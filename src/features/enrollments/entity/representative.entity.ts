import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Student } from './student.entity';

@Table({ tableName: 'representatives', timestamps: true, paranoid: false })
export class Representative extends Model {
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
  })
  declare rut: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare relationship: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare commune: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare mobilePhone: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare email: string;

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
  declare workplacePhone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare workplaceAddress: string;

  @BelongsTo(() => Student, {
    foreignKey: 'studentId',
    targetKey: 'id',
  })
  declare student: Student;
}
