const {
  sequelize,
  ObraSocial,
  Paciente,
  Ala,
  Habitacion,
  Cama,
  MotivoInternacion,
  Internacion,
  Admision
} = require('./models'); 

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Borra y recrea todas las tablas
    console.log('🔄 Sincronizando base de datos...');

    // 1. Obras Sociales
    const [osde, pami, swiss] = await Promise.all([
      ObraSocial.create({ nombre: 'OSDE' }),
      ObraSocial.create({ nombre: 'PAMI' }),
      ObraSocial.create({ nombre: 'Swiss Medical' })
    ]);

    // 2. Pacientes
    const [juan, maria, pedro] = await Promise.all([
      Paciente.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        genero: 'Masculino',
        dni: '12345678',
        altura: 1.75,
        peso: 70,
        fecha_nacimiento: new Date(1990, 5, 15),
        telefono: '123456789',
        contacto_emergencia: 'Maria Pérez',
        direccion: 'Calle Falsa 123',
        id_obra_social: osde.id_obra_social,
        estado: 'Activo',
        es_nn: false
      }),
      Paciente.create({
        nombre: 'María',
        apellido: 'López',
        genero: 'Femenino',
        dni: '87654321',
        altura: 1.68,
        peso: 60,
        fecha_nacimiento: new Date(1985, 10, 22),
        telefono: '987654321',
        contacto_emergencia: 'Carlos López',
        direccion: 'Av. Siempreviva 742',
        id_obra_social: pami.id_obra_social,
        estado: 'Activo',
        es_nn: false
      }),
      Paciente.create({
        nombre: 'Pedro',
        apellido: 'González',
        genero: 'Masculino',
        dni: '23456789',
        altura: 1.80,
        peso: 80,
        fecha_nacimiento: new Date(2000, 2, 12),
        telefono: '1122334455',
        contacto_emergencia: 'Ana González',
        direccion: 'Calle Luna 999',
        id_obra_social: swiss.id_obra_social,
        estado: 'Activo',
        es_nn: false
      })
    ]);

    // 3. Alas
    const [alaNorte, alaSur] = await Promise.all([
      Ala.create({ nombre: 'Ala Norte' }),
      Ala.create({ nombre: 'Ala Sur' })
    ]);

    // 4. Habitaciones
    const [hab101, hab102] = await Promise.all([
      Habitacion.create({ numero: '101', capacidad: 2, id_ala: alaNorte.id_ala }),
      Habitacion.create({ numero: '102', capacidad: 1, id_ala: alaSur.id_ala })
    ]);

    // 5. Camas
    const [cama1, cama2, cama3] = await Promise.all([
      Cama.create({ numero: 'C1', estado: 'Libre', id_habitacion: hab101.id_habitacion }),
      Cama.create({ numero: 'C2', estado: 'Ocupada', id_habitacion: hab101.id_habitacion }),
      Cama.create({ numero: 'C3', estado: 'Libre', id_habitacion: hab102.id_habitacion })
    ]);

    // 6. Motivos de Internación
    const [cirugia, observacion, emergencia] = await Promise.all([
      MotivoInternacion.create({ descripcion: 'Cirugía programada' }),
      MotivoInternacion.create({ descripcion: 'Observación médica' }),
      MotivoInternacion.create({ descripcion: 'Emergencia' })
    ]);

    // 7. Internaciones
    const [int1, int2] = await Promise.all([
      Internacion.create({
        fecha_ingreso: new Date(),
        estado: 'Activa',
        id_paciente: juan.id_paciente,
        id_habitacion: hab101.id_habitacion,
        id_motivo: cirugia.id_motivo,
        id_cama: cama1.id_cama
      }),
      Internacion.create({
        fecha_ingreso: new Date(),
        estado: 'Activa',
        id_paciente: maria.id_paciente,
        id_habitacion: hab102.id_habitacion,
        id_motivo: emergencia.id_motivo,
        id_cama: cama3.id_cama
      })
    ]);

    // 8. Admisiones
    await Promise.all([
      Admision.create({
        id_paciente: juan.id_paciente,
        fecha_admision: new Date(),
        tipo_ingreso: 'Programado',
        estado: 'Registrado',
        id_internacion: int1.id_internacion,
        id_habitacion: hab101.id_habitacion
      }),
      Admision.create({
        id_paciente: maria.id_paciente,
        fecha_admision: new Date(),
        tipo_ingreso: 'Urgencia',
        estado: 'Registrado',
        id_internacion: int2.id_internacion,
        id_habitacion: hab102.id_habitacion
      })
    ]);

    console.log('¡Se insertaron múltiples datos correctamente!');
  } catch (error) {
    console.error('Error al insertar datos:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
