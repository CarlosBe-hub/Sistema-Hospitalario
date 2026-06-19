const { Paciente, Internacion, Habitacion, MotivoInternacion, Cama } = require('../models');
const { Op } = require('sequelize');

const ID_ALA_EMERGENCIA = 5;

exports.vistaFormularioEmergencia = async (req, res) => {
  try {
    // Solo habitaciones del ala de emergencia
    const habitaciones = await Habitacion.findAll({
      where: { id_ala: ID_ALA_EMERGENCIA },
      order: [['numero', 'ASC']]
    });

    const motivos = await MotivoInternacion.findAll({
      order: [['descripcion', 'ASC']]
    });

    const success = req.query.success === '1';

    res.render('pacientes/emergencia', { habitaciones, motivos, success });
  } catch (error) {
    console.error('Error al cargar formulario emergencia:', error);
    res.status(500).send('Error al cargar formulario');
  }
};

exports.crearInternacionDeEmergencia = async (req, res) => {
  try {
    const { diagnostico, id_habitacion, id_motivo } = req.body;

    // Verificar que la habitación pertenezca al ala de emergencia
    const habitacion = await Habitacion.findByPk(id_habitacion);
    if (!habitacion || habitacion.id_ala !== ID_ALA_EMERGENCIA) {
      throw new Error('La habitación seleccionada no pertenece a la guardia/emergencia.');
    }

    // Buscar la primera cama libre en esa habitación
    const camaDisponible = await Cama.findOne({
      where: {
        id_habitacion: id_habitacion,
        estado: {
          [Op.in]: ['Libre', 'Higienizada', 'Disponible']
        }
      },
      order: [['numero', 'ASC']]
    });

    if (!camaDisponible) {
      throw new Error('No hay camas disponibles en la habitación seleccionada.');
    }

    //  Crear el paciente temporal NN
    const paciente = await Paciente.create({
      nombre: 'NN',
      apellido: 'NN',
      genero: 'Otro',
      dni: `NN-${Date.now()}`,
      estado: 'Activo'
    });

    // Crear la internación vinculando la cama
    await Internacion.create({
      fecha_ingreso: new Date(),
      diagnostico,
      estado: 'Activa',
      id_habitacion,
      id_cama: camaDisponible.id_cama,
      id_paciente: paciente.id_paciente,
      id_motivo: id_motivo || null
    });

    // Actualizar el estado de la cama a Ocupada
    await camaDisponible.update({ estado: 'Ocupada' });

    res.redirect('/emergencia/crear?success=1');
  } catch (error) {
    console.error('Error al internar paciente NN:', error.message);

    const habitaciones = await Habitacion.findAll({
      where: { id_ala: ID_ALA_EMERGENCIA },
      order: [['numero', 'ASC']]
    });

    const motivos = await MotivoInternacion.findAll({
      order: [['descripcion', 'ASC']]
    });

    res.status(500).render('pacientes/emergencia', {
      error: error.message || 'Error al internar paciente NN',
      habitaciones,
      motivos
    });
  }
};