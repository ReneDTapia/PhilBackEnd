# PhilBackEnd

Este repositorio contiene la REST API para [Nombre del Proyecto]. Está construido con Node.js y Sequelize y está alojado en [render.com](https://render.com).

## API Base URL

La API está disponible en: [https://philbackend.onrender.com](https://philbackend.onrender.com)

### Ejemplo de Ruta Autenticada

- Obtener Usuario: `https://philbackend.onrender.com/auth/api/GetUser`

## Estructura del Proyecto

El repositorio incluye los siguientes archivos y directorios clave:

- `config/config.json`
- `migrations/`
- `models/`
- `routes/`
- `server.js`
- `start.js`
- `test/`

## Instalación

### Paso 1: Clonar el Repositorio

1. Instalar Git desde [https://git-scm.com/download/win](https://git-scm.com/download/win).
2. Abrir la consola de comandos y ejecutar:

`git clone https://github.com/ReneDTapia/PhilBackEnd.git`
`cd PhilBackEnd`


### Paso 2: Instalar Node.js

Descargar e instalar Node.js desde [https://nodejs.org/en](https://nodejs.org/en).

### Paso 3: Instalar Dependencias

Ejecutar `npm install` para instalar todas las dependencias listadas en `package.json`.

#### Dependencias Usadas

- `bcryptjs@2.4.3`
- `body-parser@1.20.2`
- ... (listar todas las dependencias)

### Paso 4: Iniciar el Servidor

Ejecutar `npm start` para iniciar el servidor.

## Testing

Para ejecutar pruebas, usar el comando:

`npm test`
