const sequelize = require("../config/db");

const ObraSocial = require("../models/ObraSocialModel");
const MotivoInternacion = require("../models/MotivoInternacionModel");
const Ala = require("../models/AlaModel");
const Habitacion = require("../models/HabitacionModel");
const Cama = require("../models/CamaModel");
const Paciente = require("../models/PacienteModel");

async function seed() {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("🔄 Sincronizando base de datos...");

    // 1. Obras Sociales
    const [osde, pami, swiss] = await ObraSocial.bulkCreate(
      [
        { nombre: "OSDE" },
        { nombre: "PAMI" },
        { nombre: "Swiss Medical" }
      ],
      { returning: true }
    );

    // 2. Pacientes 
    const [juan, maria, carlos, ana, pedro] = await Paciente.bulkCreate(
      [
        {
          nombre: "Ernesto",
          apellido: "Pérez",
          genero: "Masculino",
          dni: "22345678",
          altura: 175,
          peso: 70,
          fecha_nacimiento: "1990-06-15",
          telefono: "123456789",
          contacto_emergencia: "1122334455",
          direccion: "Calle Falsa 123",
          es_nn: false,
          estado: "Activo",
          id_obra_social: osde.id_obra_social
        },
        {
          nombre: "María",
          apellido: "López",
          genero: "Femenino",
          dni: "87654321",
          altura: 168,
          peso: 60,
          fecha_nacimiento: "1985-11-22",
          telefono: "987654321",
          contacto_emergencia: "5566778899",
          direccion: "Av. Siempreviva 742",
          es_nn: false,
          estado: "Activo",
          id_obra_social: pami.id_obra_social
        },
        {
          nombre: "Carlos",
          apellido: "Gómez",
          genero: "Masculino",
          dni: "33445566",
          altura: 180,
          peso: 85,
          fecha_nacimiento: "1980-03-10",
          telefono: "111222333",
          contacto_emergencia: "911222333",
          direccion: "Mitre 1234",
          es_nn: false,
          estado: "Activo",
          id_obra_social: swiss.id_obra_social
        },
        {
          nombre: "Ana",
          apellido: "Martínez",
          genero: "Femenino",
          dni: "44556677",
          altura: 165,
          peso: 55,
          fecha_nacimiento: "1992-07-22",
          telefono: "444555666",
          contacto_emergencia: "944555666",
          direccion: "Belgrano 456",
          es_nn: false,
          estado: "Activo",
          id_obra_social: osde.id_obra_social
        },
        {
          nombre: "Pedro",
          apellido: "Ramírez",
          genero: "Masculino",
          dni: "55667788",
          altura: 172,
          peso: 78,
          fecha_nacimiento: "1975-12-01",
          telefono: "777888999",
          contacto_emergencia: "977888999",
          direccion: "San Martín 789",
          es_nn: false,
          estado: "Activo",
          id_obra_social: pami.id_obra_social
        }
      ],
      { returning: true }
    );

    // 3. Alas
    const [alaNorte, alaSur, alaEste, alaOeste] = await Ala.bulkCreate(
      [
        { nombre: "Ala Norte" },
        { nombre: "Ala Sur" },
        { nombre: "Ala Oeste" },
        { nombre: "Ala Este" }
      ],
      { returning: true }
    );

    // 4. Habitaciones
    const [hab101, hab102, hab103, hab104] = await Habitacion.bulkCreate(
      [
        { numero: "101", capacidad: 2, id_ala: alaNorte.id_ala },
        { numero: "102", capacidad: 2, id_ala: alaSur.id_ala },
        { numero: "103", capacidad: 2, id_ala: alaOeste.id_ala },
        { numero: "104", capacidad: 2, id_ala: alaEste.id_ala }
      ],
      { returning: true }
    );

    // 5. Camas
    const [cama1, cama2, cama3] = await Cama.bulkCreate(
      [
        { numero: "1", estado: "Disponible", id_habitacion: hab101.id_habitacion },
        { numero: "2", estado: "Disponible", id_habitacion: hab101.id_habitacion },
        { numero: "1", estado: "Disponible", id_habitacion: hab102.id_habitacion },
        { numero: "2", estado: "Disponible", id_habitacion: hab102.id_habitacion },
        { numero: "1", estado: "Disponible", id_habitacion: hab103.id_habitacion },
        { numero: "2", estado: "Disponible", id_habitacion: hab103.id_habitacion },
        { numero: "1", estado: "Disponible", id_habitacion: hab104.id_habitacion },
        { numero: "2", estado: "Disponible", id_habitacion: hab104.id_habitacion }
      ],
      { returning: true }
    );

    // 6. Motivos de Internación
    const [cirugia, observacion, Covid19, Ematoma, Fractura] = await MotivoInternacion.bulkCreate(
      [
        { descripcion: "Cirugía programada" },
        { descripcion: "Observación médica" },
        { descripcion: "Ematoma" },
        { descripcion: "Covid 19" },
        { descripcion: "Fractura" }
      ],
      { returning: true }
    );


    console.log("✅ ¡Se insertaron múltiples datos correctamente!");
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

seed();
