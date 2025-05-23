const { Paciente, Admision } = require('../models');
const { Op } = require('sequelize');

// Mostrar tabla de admisiones + modal
exports.vistaListado = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    const admisiones = await Admision.findAll({
      include: [{ model: Paciente, as: 'paciente' }],
      order: [['fecha_admision', 'DESC']]
    });

    const admisionesActivasJS = admisiones
      .filter(a => a.estado === 'activo')
      .map(a => ({
        id_admision: a.id_admision,
        id_paciente: a.id_paciente
      }));

    res.render('admision', { pacientes, admisiones, admisionesActivasJS });
  } catch (error) {
    console.error('Error al mostrar admisiones:', error);
    res.status(500).send('Error al cargar las admisiones');
  }
};

// Guardar nueva admisión
exports.guardarAdmision = async (req, res) => {
  try {
    const { id_paciente, fecha_admision, tipo_ingreso, estado } = req.body;

    // Validación campos obligatorios
    if (!id_paciente || !fecha_admision || !estado) {
      return res.status(400).send('Todos los campos obligatorios deben estar completos.');
    }

    // Verificar paciente existente
    const paciente = await Paciente.findByPk(id_paciente);
    if (!paciente) {
      return res.status(400).send('El paciente seleccionado no existe.');
    }

    // Validar fecha
    const fecha = new Date(fecha_admision);
    if (isNaN(fecha.getTime())) {
      return res.status(400).send('La fecha de admisión no es válida.');
    }
    if (fecha > new Date()) {
      return res.status(400).send('La fecha de admisión no puede ser futura.');
    }

    // Validar estado
    const estadosValidos = ['activo', 'finalizado', 'cancelado', 'en proceso...'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).send('El estado ingresado no es válido.');
    }

    // Validar duplicado activo
    if (estado === 'activo') {
      const existente = await Admision.findOne({
        where: { id_paciente, estado: 'activo' }
      });
      if (existente) {
        return res.status(400).send('Este paciente ya tiene una admisión activa.');
      }
    }

    await Admision.create({
      id_paciente,
      fecha_admision,
      tipo_ingreso,
      estado
    });

    res.redirect('/admision');
  } catch (error) {
    console.error('Error al guardar admisión:', error);
    res.status(500).send('Error al guardar la admisión');
  }
};

// Actualizar admisión existente
exports.actualizarAdmision = async (req, res) => {
  try {
    const id_admision = req.params.id;
    const { id_paciente, fecha_admision, tipo_ingreso, estado } = req.body;

    if (!id_paciente || !fecha_admision || !estado) {
      return res.status(400).send('Todos los campos obligatorios deben estar completos.');
    }

    const paciente = await Paciente.findByPk(id_paciente);
    if (!paciente) {
      return res.status(400).send('El paciente seleccionado no existe.');
    }

    const fecha = new Date(fecha_admision);
    if (isNaN(fecha.getTime())) {
      return res.status(400).send('La fecha de admisión no es válida.');
    }
    if (fecha > new Date()) {
      return res.status(400).send('La fecha de admisión no puede ser futura.');
    }

    const estadosValidos = ['activo', 'finalizado', 'cancelado', 'en proceso...'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).send('El estado ingresado no es válido.');
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
        return res.status(400).send('Este paciente ya tiene otra admisión activa.');
      }
    }

    await Admision.update(
      { id_paciente, fecha_admision, tipo_ingreso, estado },
      { where: { id_admision } }
    );

    res.redirect('/admision');
  } catch (error) {
    console.error('Error al actualizar admisión:', error);
    res.status(500).send('Error al actualizar la admisión');
  }
};

// Dar de baja admisión
exports.darDeBajaAdmision = async (req, res) => {
  try {
    const id_admision = req.params.id;

    await Admision.update(
      { estado: 'cancelado' },
      { where: { id_admision } }
    );

    res.redirect('/admision');
  } catch (error) {
    console.error('Error al dar de baja la admisión:', error);
    res.status(500).send('Error al dar de baja la admisión');
  }
};