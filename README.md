# Sistema Hospitalario De Internaciones-WEB 2👨🏻‍💻

Este es un proyecto de la materia de Progrmacion Web 2, con el fin de desarrollar un sistema hospitalario de internacion.

## Índice 📚
1. [Herramientas utilizadas 🛠](#herramientas-utilizadas-)
2. [Requisitos previos 📑](#requisitos-previos-)
3. [Configuración de las variables de entorno 🧪](#configuración-de-las-variable-de-entorno-)
4. [Pasos para la instalación y prueba del proyecto 📄](#pasos-para-la-instalacion-y-prueba-del-proyecto-)
5. [Ejecución 🎇](#ejecución-)
6. [Funcionalidades Principales 📖](#funcionalidades-principales-)
7. [Endpoints 🚩](#endpoints-)

## Funcionalidades Principales 📖

La App ofrece las siguientes funcionalidades principales:

- **Gestión de pacientes**: Alta, baja y actualización de los datos de los pacientes.
- **Admisión hospitalaria**: Registro de la entrada de los pacientes en el hospital y asignación de camas.
- **Registro clínico**: Creación y consulta de registros clínicos de los pacientes.
- **Gestión de camas**: Asignación y liberación de camas para los pacientes internados.

## Herramientas utilizadas 🛠

- Node.js + Express: desarrollo del backend y gestión de rutas.
- Sequelize: ORM para definir modelos, relaciones y ejecutar consultas a la base de datos.
- SQL: comprensión del modelo relacional. Mediante MySQL
- PUG: motor de plantillas para renderizar vistas (formularios y listados).
- CSS: estilización de vistas.
- Bootstrap 5: para la agregacion de iconos y estilos.
- Dotenv: carga de variables de entorno desde archivos .env
- Method-Override: permite el uso de métodos HTTP como PUT y PATCH desde los formularios.
- Nodemon: herramienta para reiniciar el servidor durante el desarrollo.
- DataTable: mostrar informacion paciente, admision, habitacion, etc

## Requisitos previos 📑

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes componentes:

- **Node.js** y **npm** (Node Package Manager).
- **MySQL** para gestionar la base de datos.

## Configuración de las variables de entorno 🧪

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno para configurar la conexión a la base de datos:

```bash
DB_NAME=hospital
DB_USER=root
DB_PASS=admin
DB_HOST=111.11.1
DB_PORT=3306
DB_DIALECT=mysql
```

## Pasos para la instalacion y prueba del proyecto 📄

1. Clona este repositorio:

   ```bash
   git clone https://github.com/CarlosBe-hub/Sistema-Hospitalario.git
   cd Sistema_Hospitalario
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea la base de datos en MySQL usando las configuraciones del archivo `.env`

## Ejecución 🎇

Para ejecutar el proyecto en modo de desarrollo, usa el siguiente comando:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`.


## Endpoints 🚩

### Pacientes 🚶🏻‍♂️

- `GET /pacientes`: Obtiene la lista de todos los pacientes.
- `POST /pacientes`: Crea un nuevo paciente.
- `GET /pacientes/:id`: Obtiene los detalles de un paciente por ID.
- `PUT /pacientes/:id`: Actualiza los datos de un paciente, (baja logica).

### Admisiones 📕

- `GET /admisiones`: Obtiene la lista de todas las admisiones hospitalarias.
- `POST /admisiones`: Registra una nueva admisión hospitalaria.
- `GET /admisiones/:id`: Obtiene los detalles de una admisión por ID.
- `PUT /admisiones/:id`: Actualiza una admisión hospitalaria e incluye la baja logica.

### Internaciones ⚕

- `GET /internaciones`: Obtiene la lista de todas las internaciones hospitalarias.
- `POST /internaciones`: Registra una nueva internación hospitalaria.
- `GET /internaciones/:id`: Obtiene los detalles de una internación hospitalaria por ID.
- `PUT /internaciones/:id`: Actualiza una internación hospitalaria.

### Emergencias 🚑

- `GET /emergencias/crear`: Renderiza el formulario para crear una emergencia, mostrando habitaciones y motivos de internación.
- `POST /emergencias/crear`: Crea una nueva internación de emergencia utilizando los datos del formulario.