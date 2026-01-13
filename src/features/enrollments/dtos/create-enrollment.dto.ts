import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateParentDto {
  @IsEnum(['MADRE', 'PADRE'], {
    message: 'parentType debe ser MADRE o PADRE',
  })
  @IsNotEmpty({ message: 'parentType no debe estar vacío' })
  parentType: 'MADRE' | 'PADRE';

  @IsString({ message: 'names debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'names no debe estar vacío' })
  names: string;

  @IsString({ message: 'lastNames debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'lastNames no debe estar vacío' })
  lastNames: string;

  @IsOptional()
  @IsString({ message: 'rut debe ser una cadena de texto' })
  rut?: string;

  @IsOptional()
  @IsString({ message: 'nationality debe ser una cadena de texto' })
  nationality?: string;

  @IsOptional()
  @IsString({ message: 'occupation debe ser una cadena de texto' })
  occupation?: string;

  @IsOptional()
  @IsString({ message: 'educationLevel debe ser una cadena de texto' })
  educationLevel?: string;

  @IsOptional()
  @IsString({ message: 'workplace debe ser una cadena de texto' })
  workplace?: string;

  @IsOptional()
  @IsString({ message: 'phone debe ser una cadena de texto' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de email incorrecto' })
  email?: string;
}

export class CreateFamilyInformationDto {
  @IsOptional()
  @IsEnum(['PADRE', 'MADRE', 'AMBOS', 'ABUELOS MAT', 'ABUELOS PAT', 'OTROS'], {
    message: 'householdHead debe ser un valor válido',
  })
  householdHead?:
    | 'PADRE'
    | 'MADRE'
    | 'AMBOS'
    | 'ABUELOS MAT'
    | 'ABUELOS PAT'
    | 'OTROS';

  @IsOptional()
  @IsString({ message: 'householdHeadOther debe ser una cadena de texto' })
  householdHeadOther?: string;

  @IsOptional()
  @IsEnum(
    [
      'Menos de $100.000',
      'Entre $100.000 y $200.000',
      'Entre $200.001 y $300.000',
      'Entre $300.001 y $400.000',
      'Entre $400.001 y $600.000',
      'Más de $600.000',
    ],
    {
      message: 'monthlyIncome debe ser un valor válido',
    },
  )
  monthlyIncome?:
    | 'Menos de $100.000'
    | 'Entre $100.000 y $200.000'
    | 'Entre $200.001 y $300.000'
    | 'Entre $300.001 y $400.000'
    | 'Entre $400.001 y $600.000'
    | 'Más de $600.000';

  @IsOptional()
  @IsBoolean({ message: 'socialProgramChileSolidario debe ser un booleano' })
  socialProgramChileSolidario?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'socialProgramPuente debe ser un booleano' })
  socialProgramPuente?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'socialProgramSuf debe ser un booleano' })
  socialProgramSuf?: boolean;

  @IsOptional()
  @IsString({ message: 'socialProgramOther debe ser una cadena de texto' })
  socialProgramOther?: string;

  @IsOptional()
  @IsEnum(['PROPIA', 'ARRENDADA', 'ALLEGADO'], {
    message: 'housingType debe ser PROPIA, ARRENDADA o ALLEGADO',
  })
  housingType?: 'PROPIA' | 'ARRENDADA' | 'ALLEGADO';

  @IsOptional()
  @IsString({ message: 'housingStructure debe ser una cadena de texto' })
  housingStructure?: string;

  @IsOptional()
  @IsBoolean({ message: 'hasDrinkingWater debe ser un booleano' })
  hasDrinkingWater?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'hasElectricity debe ser un booleano' })
  hasElectricity?: boolean;

  @IsOptional()
  @IsInt({ message: 'bedroomsCount debe ser un número entero' })
  bedroomsCount?: number;

  @IsOptional()
  @IsInt({ message: 'residentsCount debe ser un número entero' })
  residentsCount?: number;

  @IsOptional()
  @IsString({ message: 'casIndex debe ser una cadena de texto' })
  casIndex?: string;
}

export class CreateAuthorizedPersonDto {
  @IsOptional()
  @IsEnum(['PADRE', 'MADRE', 'AMBOS', 'ABUELOS MAT', 'ABUELOS PAT', 'OTROS'], {
    message: 'householdHead debe ser un valor válido',
  })
  householdHead?:
    | 'PADRE'
    | 'MADRE'
    | 'AMBOS'
    | 'ABUELOS MAT'
    | 'ABUELOS PAT'
    | 'OTROS';

  @IsOptional()
  @IsString({ message: 'householdHeadOther debe ser una cadena de texto' })
  householdHeadOther?: string;

  @IsOptional()
  @IsEnum(
    [
      'Menos de $100.000',
      'Entre $100.000 y $200.000',
      'Entre $200.001 y $300.000',
      'Entre $300.001 y $400.000',
      'Entre $400.001 y $600.000',
      'Más de $600.000',
    ],
    {
      message: 'monthlyIncome debe ser un valor válido',
    },
  )
  monthlyIncome?:
    | 'Menos de $100.000'
    | 'Entre $100.000 y $200.000'
    | 'Entre $200.001 y $300.000'
    | 'Entre $300.001 y $400.000'
    | 'Entre $400.001 y $600.000'
    | 'Más de $600.000';

  @IsOptional()
  @IsBoolean({ message: 'socialProgramChileSolidario debe ser un booleano' })
  socialProgramChileSolidario?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'socialProgramPuente debe ser un booleano' })
  socialProgramPuente?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'socialProgramSuf debe ser un booleano' })
  socialProgramSuf?: boolean;

  @IsOptional()
  @IsString({ message: 'socialProgramOther debe ser una cadena de texto' })
  socialProgramOther?: string;

  @IsOptional()
  @IsEnum(['PROPIA', 'ARRENDADA', 'ALLEGADO'], {
    message: 'housingType debe ser PROPIA, ARRENDADA o ALLEGADO',
  })
  housingType?: 'PROPIA' | 'ARRENDADA' | 'ALLEGADO';

  @IsOptional()
  @IsString({ message: 'housingStructure debe ser una cadena de texto' })
  housingStructure?: string;

  @IsOptional()
  @IsBoolean({ message: 'hasDrinkingWater debe ser un booleano' })
  hasDrinkingWater?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'hasElectricity debe ser un booleano' })
  hasElectricity?: boolean;

  @IsOptional()
  @IsInt({ message: 'bedroomsCount debe ser un número entero' })
  bedroomsCount?: number;

  @IsOptional()
  @IsInt({ message: 'residentsCount debe ser un número entero' })
  residentsCount?: number;

  @IsOptional()
  @IsString({ message: 'casIndex debe ser una cadena de texto' })
  casIndex?: string;
}

export class CreateRepresentativeDto {
  @IsString({ message: 'names debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'names no debe estar vacío' })
  names: string;

  @IsString({ message: 'lastNames debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'lastNames no debe estar vacío' })
  lastNames: string;

  @IsString({ message: 'rut debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'rut no debe estar vacío' })
  rut: string;

  @IsOptional()
  @IsString({ message: 'relationship debe ser una cadena de texto' })
  relationship?: string;

  @IsOptional()
  @IsString({ message: 'address debe ser una cadena de texto' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'commune debe ser una cadena de texto' })
  commune?: string;

  @IsOptional()
  @IsString({ message: 'phone debe ser una cadena de texto' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'mobilePhone debe ser una cadena de texto' })
  mobilePhone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de email incorrecto' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'occupation debe ser una cadena de texto' })
  occupation?: string;

  @IsOptional()
  @IsString({ message: 'educationLevel debe ser una cadena de texto' })
  educationLevel?: string;

  @IsOptional()
  @IsString({ message: 'workplace debe ser una cadena de texto' })
  workplace?: string;

  @IsOptional()
  @IsString({ message: 'workplacePhone debe ser una cadena de texto' })
  workplacePhone?: string;

  @IsOptional()
  @IsString({ message: 'workplaceAddress debe ser una cadena de texto' })
  workplaceAddress?: string;
}

export class CreateStudentDto {
  @IsString({ message: 'names debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'names no debe estar vacío' })
  names: string;

  @IsString({ message: 'lastNames debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'lastNames no debe estar vacío' })
  lastNames: string;

  @IsString({ message: 'rut debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'rut no debe estar vacío' })
  rut: string;

  @IsDateString({}, { message: 'birthDate debe ser una fecha válida' })
  @IsNotEmpty({ message: 'birthDate no debe estar vacío' })
  birthDate: string;

  @IsString({ message: 'nationality debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'nationality no debe estar vacío' })
  nationality: string;

  @IsString({ message: 'currentAddress debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'currentAddress no debe estar vacío' })
  currentAddress: string;

  @IsOptional()
  @IsString({ message: 'commune debe ser una cadena de texto' })
  commune?: string;

  @IsEnum(['Masculino', 'Femenino', 'Otro'], {
    message: 'gender debe ser Masculino, Femenino u Otro',
  })
  @IsNotEmpty({ message: 'gender no debe estar vacío' })
  gender: 'Masculino' | 'Femenino' | 'Otro';

  @IsOptional()
  @IsString({ message: 'prevision debe ser una cadena de texto' })
  prevision?: string;

  @IsOptional()
  @IsString({ message: 'medicalConditions debe ser una cadena de texto' })
  medicalConditions?: string;

  @IsOptional()
  @IsString({ message: 'allergies debe ser una cadena de texto' })
  allergies?: string;

  @IsOptional()
  @IsString({ message: 'medications debe ser una cadena de texto' })
  medications?: string;

  @IsOptional()
  @IsString({ message: 'specialNeeds debe ser una cadena de texto' })
  specialNeeds?: string;
}

export class CreateEnrollmentDto {
  @ValidateNested()
  @Type(() => CreateStudentDto)
  @IsNotEmpty({ message: 'student es requerido' })
  student: CreateStudentDto;

  @IsArray({ message: 'parents debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CreateParentDto)
  @IsNotEmpty({ message: 'parents no debe estar vacío' })
  parents: CreateParentDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFamilyInformationDto)
  familyInformation?: CreateFamilyInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAuthorizedPersonDto)
  authorizedPerson?: CreateAuthorizedPersonDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRepresentativeDto)
  representative?: CreateRepresentativeDto;

  @IsInt({ message: 'academicYear debe ser un número entero' })
  @IsNotEmpty({ message: 'academicYear no debe estar vacío' })
  academicYear: number;

  @IsString({ message: 'gradeLevel debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'gradeLevel no debe estar vacío' })
  gradeLevel: string;

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

  @IsDateString({}, { message: 'enrollmentDate debe ser una fecha válida' })
  @IsNotEmpty({ message: 'enrollmentDate no debe estar vacío' })
  enrollmentDate: string;
}
