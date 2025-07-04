const { Paciente, Admision, MotivoAdmision } = require('../models');
const { Op } = require('sequelize');

// Mostrar tabla de admisiones + modal
exports.vistaListado = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    const admisiones = await Admision.findAll({
      include: [
        { model: Paciente, as: 'paciente' },
        { model: MotivoAdmision, as: 'motivo_admision' }
      ],
      order: [['fecha_admision', 'DESC']]
    });

    const admisionesActivasJS = admisiones
      .filter(a => a.estado === 'activo')
      .map(a => ({
        id_admision: a.id_admision,
        id_paciente: a.id_paciente
      }));

    const motivos = await MotivoAdmision.findAll();

    res.render('admision', { pacientes, admisiones, admisionesActivasJS, motivos });
  } catch (error) {
    console.error('Error al mostrar admisiones:', error);
    res.status(500).json({ error: 'Error al cargar las admisiones' });
  }
};

// Guardar nueva admisión
exports.guardarAdmision = async (req, res) => {
  try {
    const { id_paciente, fecha_admision, id_motivo } = req.body;

    if (!id_paciente || !fecha_admision || !id_motivo) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    const paciente = await Paciente.findByPk(id_paciente);
    if (!paciente) {
      return res.status(400).json({ error: 'El paciente seleccionado no existe.' });
    }

    if (paciente.estado.toLowerCase() === 'inactivo') {
      return res.status(400).json({
        error: 'No se puede realizar la admisión. El paciente está inactivo.',
        pacienteInactivo: true
      });
    }

    const motivo = await MotivoAdmision.findByPk(id_motivo);
    if (!motivo) {
      return res.status(400).json({ error: 'El motivo de admisión no es válido.' });
    }

    const fecha = new Date(fecha_admision);
    if (isNaN(fecha.getTime())) {
      return res.status(400).json({ error: 'La fecha de admisión no es válida.' });
    }
    if (fecha > new Date()) {
      return res.status(400).json({ error: 'La fecha de admisión no puede ser futura.' });
    }

    const admisionActiva = await Admision.findOne({
      where: { id_paciente, estado: 'activo' }
    });

    if (admisionActiva) {
      return res.status(400).json({
        error: 'Este paciente ya tiene una admisión activa. El paciente está actualmente internado.',
        admisionActiva: true
      });
    }

    const nuevaAdmision = await Admision.create({
      id_paciente,
      fecha_admision,
      id_motivo,
      estado: 'activo'
    });

    const pacienteCompleto = await Paciente.findByPk(id_paciente);

    res.status(200).json({
      mensaje: 'Admision registrada correctamente.',
      admision: {
        id_admision: nuevaAdmision.id_admision,
        fecha_admision: nuevaAdmision.fecha_admision,
        id_motivo: nuevaAdmision.id_motivo,
        estado: nuevaAdmision.estado,
        paciente: {
          nombre: pacienteCompleto.nombre,
          apellido: pacienteCompleto.apellido
        }
      }
    });
  } catch (error) {
    console.error('Error al guardar admisión:', error);
    res.status(500).json({ error: 'Error al guardar la admisión' });
  }
};

// Actualizar admisión existente
exports.actualizarAdmision = async (req, res) => {
  try {
    const id_admision = req.params.id;
    const { id_paciente, fecha_admision, id_motivo, estado } = req.body;

    if (!id_paciente || !fecha_admision || !id_motivo || !estado) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    if (estado !== 'activo' && estado !== 'cancelado') {
      return res.status(400).json({ error: 'El estado debe ser "activo" o "cancelado".' });
    }

    const paciente = await Paciente.findByPk(id_paciente);
    if (!paciente) {
      return res.status(400).json({ error: 'El paciente seleccionado no existe.' });
    }

    if (paciente.estado.toLowerCase() === 'inactivo' && estado === 'activo') {
      return res.status(400).json({
        error: 'No se puede activar la admisión. El paciente está inactivo.',
        pacienteInactivo: true
      });
    }

    const motivo = await MotivoAdmision.findByPk(id_motivo);
    if (!motivo) {
      return res.status(400).json({ error: 'El motivo de admisión no es válido.' });
    }

    const fecha = new Date(fecha_admision);
    if (isNaN(fecha.getTime())) {
      return res.status(400).json({ error: 'La fecha de admisión no es válida.' });
    }
    if (fecha > new Date()) {
      return res.status(400).json({ error: 'La fecha de admisión no puede ser futura.' });
    }

    if (estado === 'activo') {
      const existente = await Admision.findOne({
        where: {
          id_paciente,
          estado: 'activo',
          id_admision: { [Op.ne]: id_admision }
        }
      });

      if (existente) {
        return res.status(400).json({ error: 'Este paciente ya tiene otra admisión activa.' });
      }
    }

    await Admision.update(
      { id_paciente, fecha_admision, id_motivo, estado },
      { where: { id_admision } }
    );

    res.status(200).json({ mensaje: 'Admision actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar admisión:', error);
    res.status(500).json({ error: 'Error al actualizar la admisión' });
  }
};

// Dar de baja admisión
exports.darDeBajaAdmision = async (req, res) => {
  try {
    const id_admision = req.params.id;

    const admision = await Admision.findByPk(id_admision);
    if (!admision) {
      return res.status(404).json({ error: 'Admision no encontrada.' });
    }

    await admision.update({ estado: 'cancelado' });

    res.status(200).json({ mensaje: 'Admision cancelada correctamente.' });
  } catch (error) {
    console.error('Error al dar de baja la admisión:', error);
    res.status(500).json({ error: 'Error al dar de baja la admisión' });
  }
};

// Buscar paciente por DNI
exports.buscarPacientePorDNI = async (req, res) => {
  try {
    let { dni } = req.params;

    if (!dni || dni.length < 6) {
      return res.status(400).json({ error: 'DNI inválido' });
    }

    dni = dni.trim();

    const paciente = await Paciente.findOne({
      where: {
        dni: {
          [Op.like]: `%${dni}%`
        }
      }
    });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const admisionActiva = await Admision.findOne({
      where: { id_paciente: paciente.id_paciente, estado: 'activo' }
    });

    res.status(200).json({
      ...paciente.toJSON(),
      admisionActiva: !!admisionActiva,
      pacienteInactivo: paciente.estado === 'inactivo'
    });
  } catch (error) {
    console.error('Error al buscar paciente por DNI:', error);
    res.status(500).json({ error: 'Error al buscar paciente' });
  }
};