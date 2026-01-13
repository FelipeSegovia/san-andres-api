# San Andres API

Esta es una API RESTful para gestionar la información de las matriculas del establecimiento,
a traves de un portal de apoderados y un panel para gestionarlas por el personal administrativo del
establecimiento. Además se crea un panel para las promotoras que permitan el seguimiento
de las matriculas del establecimiento.

## Comandos para su ejecución

`pnpm install`: Instala las dependencias del proyecto.

`pnpm run start:dev`: Inicia el servidor en modo desarrollo.

`pnpm run build`: Compila el proyecto para producción.

`pnpm run start`: Inicia el servidor en modo producción.

## Librerías utilizadas

## Comandos Sequelize

### Migraciones

#### Crear migración

- npx sequelize-cli migration:generate --name NAME_MIGRATION

#### Ejecutar migraciones

- npx sequelize-cli db:migrate

#### Revertir migraciones

- npx sequelize-cli db:migrate:undo

### Seeders

#### Crear seed

- npx sequelize-cli seed:generate --name NAME_SEED

#### Ejecutar todos los seed

- npx sequelize-cli db:seed:all

#### Ejecutar un seed especifico

- npx sequelize-cli db:seed --seed NAME_SEED.js

#### Revertir un seed

- npx sequelize-cli db:seed:undo --seed NAME_SEED.js

#### Revertir todos los seed

- npx sequelize-cli db:seed:undo:all
