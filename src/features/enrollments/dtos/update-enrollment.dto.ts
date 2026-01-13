import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsInt({ message: 'academicYear debe ser un número entero' })
  academicYear?: number;

  @IsOptional()
  @IsString({ message: 'gradeLevel debe ser una cadena de texto' })
  gradeLevel?: string;

  @IsOptional()
  @IsBoolean({ message: 'requiresJunaeb debe ser un booleano' })
  requiresJunaeb?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'requiresTransport debe ser un booleano' })
  requiresTransport?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'requiresExtendedHours debe ser un booleano' })
  requiresExtendedHours?: boolean;

  @IsOptional()
  @IsEnum(['ALTA', 'BAJA'], {
    message: 'junaebPriority debe ser ALTA o BAJA',
  })
  junaebPriority?: 'ALTA' | 'BAJA';

  @IsOptional()
  @IsEnum(['ALTA', 'BAJA'], {
    message: 'transportPriority debe ser ALTA o BAJA',
  })
  transportPriority?: 'ALTA' | 'BAJA';

  @IsOptional()
  @IsEnum(['ALTA', 'BAJA'], {
    message: 'extendedHoursPriority debe ser ALTA o BAJA',
  })
  extendedHoursPriority?: 'ALTA' | 'BAJA';

  @IsOptional()
  @IsString({ message: 'observations debe ser una cadena de texto' })
  observations?: string;

  @IsOptional()
  @IsEnum(['ACTIVA', 'RETIRADO', 'CANCELADA'], {
    message: 'status debe ser ACTIVA, RETIRADO o CANCELADA',
  })
  status?: 'ACTIVA' | 'RETIRADO' | 'CANCELADA';

  @IsOptional()
  @IsDateString({}, { message: 'enrollmentDate debe ser una fecha válida' })
  enrollmentDate?: string;
}
