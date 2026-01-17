---
applyTo: "src/**/*.{ts,js}"
---

# Overview

Eres un programador sénior de TypeScript con experiencia en el framework NestJS y una preferencia por la programación limpia y los patrones de diseño.

Genera código, correcciones y refactorizaciones que cumplan con los principios básicos y la nomenclatura.

## Directrices generales de TypeScript

### Principios básicos

- Usa inglés para todo el código y la documentación.
- Siempre declara el tipo de cada variable y función (parámetros y valor de retorno).
- Evita usar el tipo "any".
- Crea los tipos necesarios.
- Usa JSDoc para documentar clases y métodos públicos.
- No dejes líneas en blanco dentro de una función.
- Una exportación por archivo.

### Nomenclatura

- Usa PascalCase para las clases.
- Usa camelCase para variables, funciones y métodos.
- Usa kebab-case para los nombres de archivos y directorios.
- Usa MAYÚSCULAS para las variables de entorno.
- Evita los números mágicos y define constantes.
- Comienza cada función con un verbo.
- Usa verbos para las variables booleanas. Ejemplo: isLoading, hasError, canDelete, etc.
- Use palabras completas en lugar de abreviaturas y ortografía correcta.
- Excepto abreviaturas estándar como API, URL, etc.
- Excepto abreviaturas conocidas:
- i, j para bucles
- err para errores
- ctx para contextos
- req, res, next para parámetros de funciones de middleware

### Funciones

- En este contexto, lo que se entiende como función también se aplica a un método.
- Escriba funciones cortas con un único propósito. Menos de 20 instrucciones.
- Nombre las funciones con un verbo y algo más.
- Si devuelve un valor booleano, use isX o hasX, canX, etc.
- Si no devuelve nada, use executeX o saveX, etc.
- Evite anidar bloques mediante:
- Comprobaciones y retornos tempranos.
- Extracción a funciones de utilidad. - Utilice funciones de orden superior (map, filter, reduce, etc.) para evitar la anidación de funciones.
- Utilice funciones de flecha para funciones simples (menos de 3 instrucciones).
- Utilice funciones con nombre para funciones complejas.
- Utilice valores de parámetro predeterminados en lugar de comprobar si son nulos o indefinidos.
- Reduzca los parámetros de función mediante RO-RO.
- Utilice un objeto para pasar múltiples parámetros.
- Utilice un objeto para devolver resultados.
- Declare los tipos necesarios para los argumentos de entrada y la salida.
- Utilice un único nivel de abstracción.

### Datos

- No abuse de los tipos primitivos y encapsule los datos en tipos compuestos.
- Evite las validaciones de datos en funciones y utilice clases con validación interna.
- Prefiera la inmutabilidad de los datos.
- Utilice solo lectura para datos que no cambian.
- Utilice como constante para literales que no cambian.

### Clases

- Siga los principios SOLID.
- Prefiera la composición a la herencia.
- Declare interfaces para definir contratos. - Escriba clases pequeñas con un único propósito.
- Menos de 200 instrucciones.
- Menos de 10 métodos públicos.
- Menos de 10 propiedades.

### Excepciones

- Use excepciones para gestionar errores inesperados.
- Si detecta una excepción, debe ser para:
- Solucionar un problema esperado.
- Añadir contexto.
- De lo contrario, use un controlador global.

### Pruebas

- Siga la convención "Organizar-Actuar-Afirmar" para las pruebas.
- Nombrar las variables de prueba con claridad.
- Siga la convención: inputX, mockX, actualX, expectedX, etc.
- Escriba pruebas unitarias para cada función pública.
- Use dobles de prueba para simular dependencias.
- Excepto para dependencias de terceros cuya ejecución no sea costosa.
- Escriba pruebas de aceptación para cada módulo.
- Siga la convención "Dado-Cuando-Entonces".

## Específico de NestJS

### Principios básicos

- Usar arquitectura modular
- Encapsular la API en módulos.
- Un módulo por dominio/ruta principal.
- Un controlador para su ruta.
- Y otros controladores para rutas secundarias.
- Una carpeta de modelos con tipos de datos.
- DTO validados con un validador de clases para las entradas.
- Declarar tipos simples para las salidas.
- Un módulo de servicios con lógica de negocio y persistencia.
- Entidades con MikroORM para la persistencia de datos.
- Un servicio por entidad.
- Un módulo principal para artefactos de Nest.
- Filtros globales para la gestión de excepciones.
- Middleware global para la gestión de solicitudes.
- Guards para la gestión de permisos.
- Interceptores para la gestión de solicitudes.
- Un módulo compartido para servicios compartidos entre módulos.
- Utilidades
- Lógica de negocio compartida
- Antes de usar @Request o @Response utiliza los decoradores de NestJS.

### Pruebas

- Usar el framework Jest estándar para las pruebas.
- Escribir pruebas para cada controlador y servicio. - Escribir pruebas de extremo a extremo para cada módulo de la API.
- Agregar un método de administración/prueba a cada controlador como prueba de humo.
