import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Student } from './student.entity';
import { User } from '../../user/entity/user.entity';

@Table({ tableName: 'enrollments', timestamps: true, paranoid: false })
export class Enrollment extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare enrollmentNumber: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare studentId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare academicYear: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare gradeLevel: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare requiresJunaeb: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare requiresTransport: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare requiresExtendedHours: boolean;

  @Column({
    type: DataType.ENUM('ALTA', 'BAJA'),
    allowNull: true,
  })
  declare junaebPriority: 'ALTA' | 'BAJA';

  @Column({
    type: DataType.ENUM('ALTA', 'BAJA'),
    allowNull: true,
  })
  declare transportPriority: 'ALTA' | 'BAJA';

  @Column({
    type: DataType.ENUM('ALTA', 'BAJA'),
    allowNull: true,
  })
  declare extendedHoursPriority: 'ALTA' | 'BAJA';

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare observations: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare registeredByUserId: string;

  @Column({
    type: DataType.ENUM('ACTIVA', 'RETIRADO', 'CANCELADA'),
    defaultValue: 'ACTIVA',
  })
  declare status: 'ACTIVA' | 'RETIRADO' | 'CANCELADA';

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare enrollmentDate: Date;

  @BelongsTo(() => Student, {
    foreignKey: 'studentId',
    targetKey: 'id',
  })
  declare student: Student;

  @BelongsTo(() => User, {
    foreignKey: 'registeredByUserId',
    targetKey: 'id',
  })
  declare registeredByUser: User;
}
