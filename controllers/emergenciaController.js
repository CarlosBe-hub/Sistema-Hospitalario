const { Paciente, Internacion, Habitacion, MotivoInternacion, Cama, Ala, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.vistaFormularioEmergencia = async (req, res) => {
  try {
    // Traer todas las habitaciones del hospital que tengan al menos una cama disponible
    const habitaciones = await Habitacion.findAll({
      include: [
        { model: Ala, as: 'Ala' },
        {
          model: Cama,
          where: {
            estado: { [Op.in]: ['Libre', 'Higienizada', 'Disponible'] }
          },
          required: true
        }
      ],
      order: [
        ['id_ala', 'ASC'],
        ['numero', 'ASC']
      ]
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
  const t = await sequelize.transaction();
  try {
    const { diagnostico, id_habitacion, id_motivo } = req.body;

    // Buscar la primera cama libre o higienizada en la habitación elegida
    const camaDisponible = await Cama.findOne({
      where: {
        id_habitacion,
        estado: { [Op.in]: ['Libre', 'Higienizada', 'Disponible'] }
      },
      order: [['numero', 'ASC']],
      transaction: t
    });

    if (!camaDisponible) {
      throw new Error('No hay camas disponibles en la habitación seleccionada.');
    }

    // Crear el paciente temporal NN (oculto del listado general de pacientes)
    const paciente = await Paciente.create({
      nombre: 'NN',
      apellido: 'NN',
      genero: 'Otro',
      dni: `NN-${Date.now()}`,
      estado: 'Activo',
      es_nn: true
    }, { transaction: t });

    // Crear la internación vinculando la cama
    await Internacion.create({
      fecha_ingreso: new Date(),
      diagnostico,
      estado: 'Activa',
      id_habitacion,
      id_cama: camaDisponible.id_cama,
      id_paciente: paciente.id_paciente,
      id_motivo: id_motivo || null
    }, { transaction: t });

    // Actualizar el estado de la cama a Ocupada
    await camaDisponible.update({ estado: 'Ocupada' }, { transaction: t });

    await t.commit();
    res.redirect('/emergencia/crear?success=1');
  } catch (error) {
    await t.rollback();
    console.error('Error al internar paciente NN:', error.message);

    const habitaciones = await Habitacion.findAll({
      include: [
        { model: Ala, as: 'Ala' },
        {
          model: Cama,
          where: { estado: { [Op.in]: ['Libre', 'Higienizada', 'Disponible'] } },
          required: true
        }
      ],
      order: [['id_ala', 'ASC'], ['numero', 'ASC']]
    });

    const motivos = await MotivoInternacion.findAll({
      order: [['descripcion', 'ASC']]
    });

    res.status(500).render('pacientes/emergencia', {
      error: error.message || 'Error al internar paciente NN',
      habitaciones,
      motivos,
      id_motivo,
      id_habitacion,
      diagnostico
    });
  }
};