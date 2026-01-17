---
applyTo: "src/**/*.{ts,js}"
---

# Documentación de Endpoints - San Andrés API

## Base URL

- **Desarrollo**: `http://localhost:3000`
- **Producción**: Configurado mediante variable de entorno `PORT` (por defecto: 3000)

## Autenticación

La mayoría de los endpoints requieren autenticación mediante Bearer Token. El token se obtiene mediante el endpoint de login y debe enviarse en el header `Authorization` con el formato: `Bearer {token}`

---

## Logging en Servicios y Controladores

### Reglas Generales de Logging

Cada servicio y controlador **DEBE** incluir logs estructurados siguiendo estos principios:

#### 1. **Inyección de Logger**

Todos los servicios y controladores deben inyectar el logger de Pino:

```typescript
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Injectable() // o @Controller
export class MyService {
  constructor(
    // ... otras dependencias
    @InjectPinoLogger(MyService.name) private readonly logger: PinoLogger
  ) {
    this.logger.setContext(MyService.name);
  }
}
```

#### 2. **Niveles de Log**

- **`debug`**: Información de seguimiento detallada (operaciones internas, búsquedas simples)
- **`info`**: Operaciones principales exitosas (crear, actualizar, eliminar recursos)
- **`warn`**: Advertencias que no impiden el flujo (recurso no encontrado, validaciones fallidas)
- **`error`**: Errores que requieren atención (excepciones no esperadas, fallos de transacción)

#### 3. **Estructura de Logs en Cada Endpoint/Método**

**En Controladores:**

```typescript
@Post()
async create(@Body() dto: CreateDto): Promise<Response> {
  // 1. Log de solicitud
  this.logger.info({ email, data }, "resource:create request");

  try {
    // 2. Lógica principal
    const result = await this.service.create(dto);

    // 3. Log de éxito
    this.logger.info({ id: result.id }, "resource:create success");
    return result;
  } catch (error) {
    // 4. Log de error/advertencia
    this.logger.warn({ email, error: error.message }, "resource:create failed");
    throw error;
  }
}
```

**En Servicios:**

```typescript
async create(dto: CreateDto): Promise<Resource> {
  this.logger.info({ email }, "resource:create service request");

  try {
    const resource = await this.model.create({ ...dto });
    this.logger.info({ id: resource.id }, "resource:create success");
    return resource;
  } catch (error) {
    if (error instanceof ConflictException) {
      this.logger.warn({ email }, "resource:create conflict");
    } else {
      this.logger.error({ email, error: error.message }, "resource:create failed");
    }
    throw error;
  }
}
```

#### 4. **Formato de Mensajes de Log**

El formato debe seguir: `{modulo}:{accion} {contexto}`

Ejemplos:

- `users:create request` - Solicitud para crear usuario
- `users:create success` - Usuario creado exitosamente
- `users:update failed` - Error al actualizar usuario
- `auth:signIn invalid password` - Error específico de validación
- `enrollments:getAll request` - Solicitud para obtener todas las matrículas
- `enrollments:delete not found` - Matrícula no encontrada para eliminar

#### 5. **Contexto en Logs**

Incluir información relevante pero **SIN DATOS SENSIBLES**:

```typescript
// ✅ Correcto - Información útil sin sensibilidad
this.logger.info(
  {
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
  },
  "users:create success"
);

// ❌ Incorrecto - Incluye datos sensibles
this.logger.info({ user }, "users:create success"); // No loguear el objeto completo

// ❌ Incorrecto - Muy genérico
this.logger.info({}, "users:create success"); // No proporciona contexto útil
```

**Datos sensibles que NUNCA deben loguearse:**

- Contraseñas
- Tokens JWT
- Números de tarjeta
- Información médica sensible

#### 6. **Logs Específicos por Tipo de Operación**

**Para operaciones de lectura:**

```typescript
async findAll(): Promise<Resource[]> {
  this.logger.debug({}, "resource:findAll request");
  try {
    const resources = await this.model.findAll();
    this.logger.debug({ count: resources.length }, "resource:findAll success");
    return resources;
  } catch (error) {
    this.logger.error({ error: error.message }, "resource:findAll failed");
    throw error;
  }
}
```

**Para operaciones de escritura (crear/actualizar/eliminar):**

```typescript
async delete(id: string): Promise<void> {
  this.logger.info({ resourceId: id }, "resource:delete request");
  try {
    await this.model.destroy({ where: { id } });
    this.logger.info({ resourceId: id }, "resource:delete success");
  } catch (error) {
    this.logger.error({ resourceId: id, error: error.message }, "resource:delete failed");
    throw error;
  }
}
```

**Para transacciones:**

```typescript
async createWithTransaction(dto: CreateDto): Promise<Resource> {
  const transaction = await this.sequelize.transaction();
  this.logger.info({ studentName: dto.name }, "resource:create transaction start");

  try {
    // ... operaciones con transacción
    await transaction.commit();
    this.logger.info({ resourceId: result.id }, "resource:create transaction committed");
    return result;
  } catch (error) {
    await transaction.rollback();
    this.logger.error({ error: error.message }, "resource:create transaction rolled back");
    throw error;
  }
}
```

#### 7. **Manejo de Errores Específicos**

```typescript
async update(id: string, dto: UpdateDto): Promise<Resource> {
  this.logger.info({ resourceId: id }, "resource:update request");

  try {
    const resource = await this.model.findByPk(id);

    if (!resource) {
      this.logger.warn({ resourceId: id }, "resource:update not found");
      throw new NotFoundException(`Resource ${id} not found`);
    }

    // ... resto de lógica
  } catch (error) {
    if (error instanceof NotFoundException) {
      // Ya fue logueado con warn
      throw error;
    }

    if (error instanceof UniqueConstraintError) {
      this.logger.warn({ resourceId: id }, "resource:update unique constraint violation");
      throw new ConflictException("Resource already exists");
    }

    this.logger.error({ resourceId: id, error: error.message }, "resource:update failed");
    throw error;
  }
}
```

#### 8. **Logs en Guards y Middleware**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectPinoLogger(AuthGuard.name) private readonly logger: PinoLogger
  ) {
    this.logger.setContext(AuthGuard.name);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    this.logger.debug({ path: request.path }, "auth:guard validation");

    if (!token) {
      this.logger.warn({ path: request.path }, "auth:guard missing token");
      throw new UnauthorizedException();
    }

    return true;
  }
}
```

#### 9. **Formato de Contexto por Entidad**

| Entidad     | Contexto Recomendado                                              |
| ----------- | ----------------------------------------------------------------- |
| Users       | `userId`, `email`, `roleId`                                       |
| Roles       | `roleId`, `name`                                                  |
| Auth        | `email`, `valid`                                                  |
| Enrollments | `enrollmentId`, `enrollmentNumber`, `studentName`, `academicYear` |
| Students    | `studentId`, `studentName`, `rut`                                 |
| Parents     | `parentId`, `parentName`, `studentId`                             |

---

## Módulo: Auth (Autenticación)

### POST /auth/login

**Descripción**: Inicia sesión en el sistema y obtiene un token de acceso.

**Autenticación**: No requerida

**Body**:

```typescript
{
  email: string; // Email válido, requerido
  password: string; // Contraseña, requerido
}
```

**Respuesta** (200 OK):

```typescript
{
  accessToken: string; // JWT token para autenticación
}
```

---

### POST /auth/register

**Descripción**: Registra un nuevo usuario en el sistema.

**Autenticación**: No requerida

**Body**:

```typescript
{
  firstName: string; // Nombre, requerido
  lastName: string; // Apellido, requerido
  email: string; // Email válido, requerido
  password: string; // Contraseña, requerido
}
```

**Respuesta** (201 Created):

```typescript
{
  accessToken: string; // JWT token para autenticación
}
```

---

### GET /auth/validate

**Descripción**: Valida si un token de acceso es válido.

**Autenticación**: Requerida (Bearer Token en header `Authorization`)

**Headers**:

```
Authorization: Bearer {token}
```

**Respuesta** (200 OK):

```typescript
{
  validateToken: boolean; // true si el token es válido, false en caso contrario
}
```

**Errores**:

- 401 Unauthorized: Si no se proporciona el token

---

## Módulo: Users (Usuarios)

### POST /users

**Descripción**: Crea un nuevo usuario en el sistema.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`

**Body**:

```typescript
{
  firstName: string; // Nombre, requerido
  lastName: string; // Apellido, requerido
  email: string; // Email válido, requerido
  password: string; // Contraseña, requerido
}
```

**Respuesta** (201 Created):

```typescript
{
  id: string;           // UUID del usuario
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roleId: string | null;
  role?: Role;          // Objeto Role si está incluido
  createdAt: Date;
  updatedAt: Date;
}
```

---

### PATCH /users/:id

**Descripción**: Actualiza la información de un usuario existente.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`, `User`

**Parámetros de ruta**:

- `id`: string (UUID del usuario)

**Body** (todos los campos son opcionales):

```typescript
{
  firstName?: string;   // Nombre
  lastName?: string;    // Apellido
  email?: string;       // Email válido
  password?: string;     // Contraseña
  roleId?: string;      // UUID del rol
}
```

**Respuesta** (200 OK):

```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roleId: string | null;
  role?: Role;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### GET /users

**Descripción**: Obtiene un usuario por su email.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `User`, `Admin`

**Query Parameters**:

- `email`: string (Email válido, requerido)

**Ejemplo de uso**: `GET /users?email=usuario@example.com`

**Respuesta** (200 OK):

```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roleId: string | null;
  role?: Role;
  createdAt: Date;
  updatedAt: Date;
} | null
```

---

## Módulo: Roles (Roles)

### POST /roles

**Descripción**: Crea un nuevo rol en el sistema.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`

**Body**:

```typescript
{
  name: string; // Nombre del rol, requerido
  description: string; // Descripción del rol, requerido
}
```

**Respuesta** (201 Created):

```typescript
{
  id: string; // UUID del rol
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### GET /roles

**Descripción**: Obtiene todos los roles del sistema.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`

**Respuesta** (200 OK):

```typescript
Array<{
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}>;
```

---

### GET /roles/:id

**Descripción**: Obtiene un rol específico por su ID.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`, `User`

**Parámetros de ruta**:

- `id`: string (UUID del rol)

**Respuesta** (200 OK):

```typescript
{
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
} | null
```

---

## Módulo: Enrollments (Matrículas)

### POST /enrollments

**Descripción**: Crea una nueva matrícula en el sistema.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`, `User`

**Body**:

```typescript
{
  student: {
    names: string;                    // Nombres del estudiante, requerido
    lastNames: string;                 // Apellidos del estudiante, requerido
    rut: string;                      // RUT del estudiante, requerido
    birthDate: string;                 // Fecha de nacimiento (ISO date string), requerido
    nationality: string;               // Nacionalidad, requerido
    currentAddress: string;            // Dirección actual, requerido
    commune?: string;                  // Comuna, opcional
    gender: 'Masculino' | 'Femenino' | 'Otro';  // Género, requerido
    prevision?: string;                // Previsión, opcional
    medicalConditions?: string;        // Condiciones médicas, opcional
    allergies?: string;                 // Alergias, opcional
    medications?: string;               // Medicamentos, opcional
    specialNeeds?: string;             // Necesidades especiales, opcional
  };
  parents: Array<{
    parentType: 'MADRE' | 'PADRE';    // Tipo de padre, requerido
    names: string;                     // Nombres, requerido
    lastNames: string;                 // Apellidos, requerido
    rut?: string;                      // RUT, opcional
    nationality?: string;              // Nacionalidad, opcional
    occupation?: string;               // Ocupación, opcional
    educationLevel?: string;            // Nivel educacional, opcional
    workplace?: string;                 // Lugar de trabajo, opcional
    phone?: string;                    // Teléfono, opcional
    email?: string;                    // Email válido, opcional
  }>;
  familyInformation?: {
    householdHead?: 'PADRE' | 'MADRE' | 'AMBOS' | 'ABUELOS MAT' | 'ABUELOS PAT' | 'OTROS';
    householdHeadOther?: string;
    monthlyIncome?: 'Menos de $100.000' | 'Entre $100.000 y $200.000' | 'Entre $200.001 y $300.000' | 'Entre $300.001 y $400.000' | 'Entre $400.001 y $600.000' | 'Más de $600.000';
    socialProgramChileSolidario?: boolean;
    socialProgramPuente?: boolean;
    socialProgramSuf?: boolean;
    socialProgramOther?: string;
    housingType?: 'PROPIA' | 'ARRENDADA' | 'ALLEGADO';
    housingStructure?: string;
    hasDrinkingWater?: boolean;
    hasElectricity?: boolean;
    bedroomsCount?: number;
    residentsCount?: number;
    casIndex?: string;
  };
  authorizedPerson?: {
    // Misma estructura que familyInformation
    householdHead?: 'PADRE' | 'MADRE' | 'AMBOS' | 'ABUELOS MAT' | 'ABUELOS PAT' | 'OTROS';
    householdHeadOther?: string;
    monthlyIncome?: 'Menos de $100.000' | 'Entre $100.000 y $200.000' | 'Entre $200.001 y $300.000' | 'Entre $300.001 y $400.000' | 'Entre $400.001 y $600.000' | 'Más de $600.000';
    socialProgramChileSolidario?: boolean;
    socialProgramPuente?: boolean;
    socialProgramSuf?: boolean;
    socialProgramOther?: string;
    housingType?: 'PROPIA' | 'ARRENDADA' | 'ALLEGADO';
    housingStructure?: string;
    hasDrinkingWater?: boolean;
    hasElectricity?: boolean;
    bedroomsCount?: number;
    residentsCount?: number;
    casIndex?: string;
  };
  representative?: {
    names: string;                     // Nombres, requerido
    lastNames: string;                 // Apellidos, requerido
    rut: string;                       // RUT, requerido
    relationship?: string;             // Relación, opcional
    address?: string;                  // Dirección, opcional
    commune?: string;                  // Comuna, opcional
    phone?: string;                    // Teléfono, opcional
    mobilePhone?: string;              // Teléfono móvil, opcional
    email?: string;                    // Email válido, opcional
    occupation?: string;               // Ocupación, opcional
    educationLevel?: string;           // Nivel educacional, opcional
    workplace?: string;                // Lugar de trabajo, opcional
    workplacePhone?: string;           // Teléfono del trabajo, opcional
    workplaceAddress?: string;         // Dirección del trabajo, opcional
  };
  academicYear: number;                // Año académico, requerido
  gradeLevel: string;                  // Nivel de grado, requerido
  requiresJunaeb?: boolean;            // Requiere JUNAEB, opcional
  requiresTransport?: boolean;         // Requiere transporte, opcional
  requiresExtendedHours?: boolean;      // Requiere horario extendido, opcional
  junaebPriority?: 'ALTA' | 'BAJA';    // Prioridad JUNAEB, opcional
  transportPriority?: 'ALTA' | 'BAJA'; // Prioridad transporte, opcional
  extendedHoursPriority?: 'ALTA' | 'BAJA'; // Prioridad horario extendido, opcional
  observations?: string;               // Observaciones, opcional
  enrollmentDate: string;              // Fecha de matrícula (ISO date string), requerido
}
```

**Respuesta** (201 Created):

```typescript
{
  id: string;                          // UUID de la matrícula
  enrollmentNumber: string;            // Número único de matrícula
  studentId: string;                   // UUID del estudiante
  academicYear: number;
  gradeLevel: string;
  requiresJunaeb: boolean;
  requiresTransport: boolean;
  requiresExtendedHours: boolean;
  junaebPriority: 'ALTA' | 'BAJA' | null;
  transportPriority: 'ALTA' | 'BAJA' | null;
  extendedHoursPriority: 'ALTA' | 'BAJA' | null;
  observations: string | null;
  registeredByUserId: string | null;
  status: 'ACTIVA' | 'RETIRADO' | 'CANCELADA';
  enrollmentDate: Date;
  student?: Student;                   // Objeto Student si está incluido
  registeredByUser?: User;             // Objeto User si está incluido
  createdAt: Date;
  updatedAt: Date;
}
```

---

### GET /enrollments

**Descripción**: Obtiene todas las matrículas del sistema.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`, `User`

**Respuesta** (200 OK):

```typescript
Array<{
  id: string;
  enrollmentNumber: string;
  studentId: string;
  academicYear: number;
  gradeLevel: string;
  requiresJunaeb: boolean;
  requiresTransport: boolean;
  requiresExtendedHours: boolean;
  junaebPriority: "ALTA" | "BAJA" | null;
  transportPriority: "ALTA" | "BAJA" | null;
  extendedHoursPriority: "ALTA" | "BAJA" | null;
  observations: string | null;
  registeredByUserId: string | null;
  status: "ACTIVA" | "RETIRADO" | "CANCELADA";
  enrollmentDate: Date;
  student?: Student;
  registeredByUser?: User;
  createdAt: Date;
  updatedAt: Date;
}>;
```

---

### GET /enrollments/:id

**Descripción**: Obtiene una matrícula específica por su ID.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`, `User`

**Parámetros de ruta**:

- `id`: string (UUID de la matrícula)

**Respuesta** (200 OK):

```typescript
{
  id: string;
  enrollmentNumber: string;
  studentId: string;
  academicYear: number;
  gradeLevel: string;
  requiresJunaeb: boolean;
  requiresTransport: boolean;
  requiresExtendedHours: boolean;
  junaebPriority: 'ALTA' | 'BAJA' | null;
  transportPriority: 'ALTA' | 'BAJA' | null;
  extendedHoursPriority: 'ALTA' | 'BAJA' | null;
  observations: string | null;
  registeredByUserId: string | null;
  status: 'ACTIVA' | 'RETIRADO' | 'CANCELADA';
  enrollmentDate: Date;
  student?: Student;
  registeredByUser?: User;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### GET /enrollments/number/:enrollmentNumber

**Descripción**: Obtiene una matrícula por su número de matrícula.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`, `User`

**Parámetros de ruta**:

- `enrollmentNumber`: string (Número de matrícula)

**Respuesta** (200 OK):

```typescript
{
  id: string;
  enrollmentNumber: string;
  studentId: string;
  academicYear: number;
  gradeLevel: string;
  requiresJunaeb: boolean;
  requiresTransport: boolean;
  requiresExtendedHours: boolean;
  junaebPriority: 'ALTA' | 'BAJA' | null;
  transportPriority: 'ALTA' | 'BAJA' | null;
  extendedHoursPriority: 'ALTA' | 'BAJA' | null;
  observations: string | null;
  registeredByUserId: string | null;
  status: 'ACTIVA' | 'RETIRADO' | 'CANCELADA';
  enrollmentDate: Date;
  student?: Student;
  registeredByUser?: User;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### PATCH /enrollments/:id

**Descripción**: Actualiza una matrícula existente.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`

**Parámetros de ruta**:

- `id`: string (UUID de la matrícula)

**Body** (todos los campos son opcionales):

```typescript
{
  academicYear?: number;
  gradeLevel?: string;
  requiresJunaeb?: boolean;
  requiresTransport?: boolean;
  requiresExtendedHours?: boolean;
  junaebPriority?: 'ALTA' | 'BAJA';
  transportPriority?: 'ALTA' | 'BAJA';
  extendedHoursPriority?: 'ALTA' | 'BAJA';
  observations?: string;
  status?: 'ACTIVA' | 'RETIRADO' | 'CANCELADA';
  enrollmentDate?: string;  // ISO date string
}
```

**Respuesta** (200 OK):

```typescript
{
  id: string;
  enrollmentNumber: string;
  studentId: string;
  academicYear: number;
  gradeLevel: string;
  requiresJunaeb: boolean;
  requiresTransport: boolean;
  requiresExtendedHours: boolean;
  junaebPriority: 'ALTA' | 'BAJA' | null;
  transportPriority: 'ALTA' | 'BAJA' | null;
  extendedHoursPriority: 'ALTA' | 'BAJA' | null;
  observations: string | null;
  registeredByUserId: string | null;
  status: 'ACTIVA' | 'RETIRADO' | 'CANCELADA';
  enrollmentDate: Date;
  student?: Student;
  registeredByUser?: User;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### DELETE /enrollments/:id

**Descripción**: Elimina una matrícula del sistema.

**Autenticación**: Requerida (Bearer Token)

**Roles permitidos**: `Admin`

**Parámetros de ruta**:

- `id`: string (UUID de la matrícula)

**Respuesta** (200 OK): Sin contenido (void)

---

## Códigos de Estado HTTP

- **200 OK**: Solicitud exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error en la solicitud (validación fallida)
- **401 Unauthorized**: No autenticado o token inválido
- **403 Forbidden**: No tiene permisos para realizar la acción
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Configuración y Buenas Prácticas de Logging con nestjs-pino

### Configuración Global (app.module.ts)

La configuración de logging en el proyecto está centralizada y utiliza `nestjs-pino` con los siguientes parámetros:

- **Niveles**: `debug` en desarrollo, `info` en producción
- **Formato**: JSON en producción, `pino-pretty` en desarrollo
- **Redacción**: Datos sensibles (`authorization`, `password`, `token`, `cookies`, `x-api-key`) son automáticamente enmascarados
- **Auto-logging**: Deshabilitado para `/health` y `/alive` para reducir ruido
- **Request ID**: Se genera automáticamente o se acepta el header `x-request-id` para trazabilidad
- **Serialización**: Métodos y URLs se serializan automáticamente en cada log

### Ejecución en Contenedores

- Toda la salida debe dirigirse a **stdout/stderr** (la configuración por defecto ya lo hace)
- Docker, PM2 o Kubernetes capturan y gestionan los logs automáticamente
- **Nunca escribir directamente a disco** en contenedores

### Resumen de Buenas Prácticas

1. ✅ **Usa JSON en producción** y `pino-pretty` solo en desarrollo
2. ✅ **Define niveles por ambiente**: `debug` en dev, `info` en prod
3. ✅ **Configura redacción**: Oculta automáticamente datos sensibles
4. ✅ **Activa autoLogging** con excepciones para health checks
5. ✅ **Genera y propaga requestId** para correlacionar logs
6. ✅ **Incluye contexto relevante** en cada log (usuario, rol, operación)
7. ✅ **No loguees cuerpos completos** en producción - solo metadatos
8. ✅ **Sanitiza errores** antes de registrar stack traces
9. ✅ **En transacciones**: Loguea inicio, commit y rollback
10. ✅ **Maneja errores específicos**: Diferencia entre warn, error e info

---

## Notas Importantes

1. **Autenticación Bearer Token**: Para endpoints que requieren autenticación, incluir el header:

   ```
   Authorization: Bearer {token}
   ```

2. **Validación de Datos**: Todos los endpoints validan los datos de entrada según las reglas definidas en los DTOs. Los errores de validación retornan código 400.

3. **Roles**: Los roles disponibles en el sistema son:

   - `Admin`: Acceso completo al sistema
   - `User`: Acceso limitado (apoderados)

4. **UUIDs**: Todos los IDs de recursos son UUIDs v4.

5. **Fechas**: Las fechas se manejan como strings en formato ISO 8601 (ej: "2024-01-15") o como objetos Date en las respuestas.

6. **Swagger Documentation**: La documentación interactiva de la API está disponible en `/docs` cuando el servidor está en ejecución.
