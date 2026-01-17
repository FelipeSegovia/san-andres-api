---
applyTo: "src/**/*.{ts,js}"
---

# Lógica de Negocio

## Actores del Sistema

### 1. Apoderado (Padre/Madre)

- Puede registrarse e iniciar sesión en el sistema
- Puede crear matrículas para sus hijos/as
- Puede dar seguimiento al estado de las matrículas creadas
- Puede visualizar el número de contacto del establecimiento
- Solo puede ver y gestionar las matrículas de sus propios hijos/as

### 2. Promotora

- Capta estudiantes a través de publicidad y marketing
- Genera rutas/links específicos para que los padres completen el formulario de matrícula
- Tiene acceso a un panel de administración donde puede:
  - Ver el estado de las matrículas de los estudiantes captados
  - Visualizar gráficos de registro por día/semana/mes
  - Ver el monto monetario acumulado por cada estudiante captado

### 3. Administrador (Director/Directora)

- Tiene acceso completo al panel de administración
- Puede ver todas las nuevas matrículas en la cola de gestión
- Puede modificar el contenido y el estado de cualquier matrícula
- Puede crear nuevas matrículas manualmente
- Recibe notificaciones (correo electrónico o WhatsApp) cada vez que se ingresa una nueva matrícula a la cola

## Proceso de Matriculación

### Origen de las Matrículas

Las matrículas pueden tener dos orígenes:

1. **Origen Autónomo (Apoderado)**

   - El apoderado ingresa al sitio web por su cuenta
   - Se registra en el sistema
   - Inicia sesión
   - Completa el formulario de matrícula para su hijo/a

2. **Origen por Promotora**
   - Una promotora genera una ruta/link específico
   - El apoderado accede a través de esa ruta
   - Completa el formulario de matrícula
   - El sistema debe registrar que la matrícula proviene de esa promotora

### Flujo del Formulario de Matrícula

1. El apoderado (o promotora) accede al formulario
2. Se completa el formulario con la información del estudiante
3. Una vez completado, el sistema registra la matrícula
4. El apoderado puede visualizar el proceso/estado de la matrícula
5. La matrícula entra en la cola de gestión del administrador

### Seguimiento de Estado

- Cada matrícula tiene un estado que puede ser modificado por el administrador
- El apoderado puede visualizar el estado actual de sus matrículas
- El estado debe reflejar el progreso en el proceso de admisión

## Funcionalidades por Actor

### Panel del Apoderado

**Acciones disponibles:**

- Crear nuevas matrículas
- Ver lista de matrículas creadas
- Ver detalle y estado de cada matrícula
- Visualizar número de contacto del establecimiento
- Dar seguimiento al proceso de admisión

**Restricciones:**

- Solo puede ver y gestionar matrículas de sus propios hijos/as
- No puede modificar matrículas una vez creadas (solo visualización)

### Panel de la Promotora

**Acciones disponibles:**

- Generar rutas/links específicos para captación
- Ver lista de estudiantes captados
- Ver estado de las matrículas de estudiantes captados
- Visualizar gráficos y estadísticas:
  - Registros por día
  - Registros por semana
  - Registros por mes
- Ver monto monetario acumulado por estudiante captado

**Restricciones:**

- Solo puede ver matrículas generadas a través de sus rutas/links
- No puede modificar el contenido de las matrículas

### Panel del Administrador

**Acciones disponibles:**

- Ver todas las nuevas matrículas en la cola
- Modificar el contenido de cualquier matrícula
- Modificar el estado de cualquier matrícula
- Crear nuevas matrículas manualmente
- Recibir notificaciones de nuevas matrículas

**Notificaciones:**

- Se envía una notificación cada vez que se ingresa una nueva matrícula
- Las notificaciones pueden ser por:
  - Correo electrónico
  - WhatsApp
- El administrador debe poder configurar sus preferencias de notificación

## Reglas de Negocio Técnicas

### Identificación de Origen

- Cada matrícula debe registrar su origen (apoderado autónomo o promotora)
- Si es por promotora, debe asociarse con la promotora correspondiente
- Las rutas/links de promotoras deben tener un identificador único que permita rastrear el origen

### Seguimiento Monetario para Promotoras

- El sistema debe calcular y registrar el monto monetario por cada estudiante captado por promotora
- Este monto debe ser acumulable y visible en los reportes
- Los gráficos deben mostrar el monto total acumulado por período

### Estados de Matrícula

- El sistema debe tener un flujo de estados para las matrículas
- Los estados deben reflejar el progreso en el proceso de admisión
- Solo el administrador puede modificar los estados
- El apoderado puede visualizar el estado pero no modificarlo

### Seguridad y Permisos

- Los apoderados solo pueden acceder a sus propias matrículas
- Las promotoras solo pueden ver matrículas asociadas a ellas
- Los administradores tienen acceso completo al sistema
- Todas las acciones deben estar auditadas (quién, cuándo, qué)

## Consideraciones de Implementación

### Datos Requeridos

- El formulario de matrícula debe capturar toda la información necesaria del estudiante
- Debe incluir información de los padres/apoderados
- Debe registrar información sobre servicios requeridos (transporte, alimentación, etc.)

### Notificaciones

- El sistema debe tener un mecanismo de notificaciones asíncrono
- Debe soportar múltiples canales (email, WhatsApp)
- Debe ser configurable por administrador

### Reportes y Gráficos

- Los gráficos para promotoras deben ser generados en tiempo real o cerca de tiempo real
- Debe permitir filtros por período (día, semana, mes)
- Los montos monetarios deben ser calculables y rastreables
