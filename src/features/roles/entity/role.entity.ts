import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/features/user/entity/user.entity';

@Table({
  tableName: 'roles',
  timestamps: true,
  paranoid: false,
})
export class Role extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  // HasMany significa que un rol puede tener muchos usuarios
  @HasMany(() => User, {
    foreignKey: 'roleId',
    sourceKey: 'id', // Referencia la clave primaria en Role
  })
  declare users: User[];
}
