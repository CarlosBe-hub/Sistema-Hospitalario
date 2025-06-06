const { Paciente, Internacion, Habitacion, MotivoInternacion } = require('../models');

exports.vistaFormularioEmergencia = async (req, res) => {
  try {
    const habitaciones = await Habitacion.findAll({ order: [['numero', 'ASC']] });
    const motivos = await MotivoInternacion.findAll({ order: [['descripcion', 'ASC']] });

    const success = req.query.success === '1';

    res.render('emergencia', { habitaciones, motivos, success });
  } catch (error) {
    console.error('Error al cargar formulario emergencia:', error);
    res.status(500).send('Error al cargar formulario');
  }
};

exports.crearInternacionDeEmergencia = async (req, res) => {
  try {
    const { diagnostico, id_habitacion, id_motivo } = req.body;

    const paciente = await Paciente.create({
      nombre: 'NN',
      apellido: 'NN',
      genero: 'Otro',
      dni: `NN-${Date.now()}`,
      estado: 'Activo'
    });

    await Internacion.create({
      fecha_ingreso: new Date(),
      diagnostico,
      estado: 'Activa',
      id_habitacion,
      id_paciente: paciente.id_paciente,
      id_motivo: id_motivo || null
    });

    res.redirect('/emergencia/crear?success=1');
  } catch (error) {
    console.error('Error al internar paciente NN:', error);

    const habitaciones = await Habitacion.findAll({ order: [['numero', 'ASC']] });
    const motivos = await MotivoInternacion.findAll({ order: [['descripcion', 'ASC']] });

    res.status(500).render('emergencia', {
      error: 'Error al internar paciente NN',
      habitaciones,
      motivos
    });
  }
};
