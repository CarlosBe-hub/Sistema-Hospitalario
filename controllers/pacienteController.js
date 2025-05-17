const Paciente = require('../models/PacienteModel');
const calcularEdad = require('../utils/calcularEdad');

// Mostrar vista principal de pacientes activos
exports.verActivos = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({ where: { estado: 'Activo' } });

    const pacientesProcesados = pacientes.map(p => {
      const edad = calcularEdad(p.fecha_nacimiento);
      return {
        ...p.dataValues,
        edad,
        fechaISO: p.fecha_nacimiento ? p.fecha_nacimiento.toISOString() : null
      };
    });

    res.render('pacientes', { pacientes: pacientesProcesados });
  } catch (error) {
    console.error('Error al cargar pacientes activos:', error);
    res.status(500).send('Error al cargar la vista de pacientes');
  }
};

// API: obtener todos los pacientes activos (AJAX)
exports.obtenerTodosPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({ where: { estado: 'Activo' } });

    const pacientesProcesados = pacientes.map(p => {
      const edad = calcularEdad(p.fecha_nacimiento);
      return {
        ...p.dataValues,
        edad,
        fecha_nacimiento: p.fecha_nacimiento
          ? new Date(p.fecha_nacimiento).toLocaleDateString('es-ES')
          : ''
      };
    });

    res.json({ data: pacientesProcesados });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};

// Mostrar formulario de edición
exports.mostrarFormularioEditar = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).send('Paciente no encontrado');
    res.render('editarPaciente', { paciente });
  } catch (error) {
    console.error('Error al mostrar formulario de edición:', error);
    res.status(500).send('Error al mostrar formulario');
  }
};

// Actualizar paciente
exports.actualizarPaciente = async (req, res) => {
  try {
    await Paciente.update(req.body, {
      where: { id_paciente: req.params.id }
    });
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).send('Error al actualizar paciente');
  }
};

// Eliminación lógica (cambiar estado a Inactivo)
exports.eliminarPaciente = async (req, res) => {
  try {
    await Paciente.update({ estado: 'Inactivo' }, {
      where: { id_paciente: req.params.id }
    });
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).send('Error al eliminar paciente');
  }
};

// Ver lista de pacientes inactivos
exports.verInactivos = (req, res) => {
  res.render('pacientesInactivos');
};

// API: obtener pacientes inactivos
exports.apiInactivos = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({ where: { estado: 'Inactivo' } });

    const pacientesProcesados = pacientes.map(p => ({
      ...p.dataValues,
      fecha_nacimiento: p.fecha_nacimiento
        ? new Date(p.fecha_nacimiento).toLocaleDateString('es-ES')
        : ''
    }));

    res.json({ data: pacientesProcesados });
  } catch (error) {
    console.error('Error al obtener pacientes inactivos:', error);
    res.status(500).json({ error: 'Error al obtener pacientes inactivos' });
  }
};

// Restaurar paciente (cambiar estado a Activo)
exports.restaurarPaciente = async (req, res) => {
  try {
    await Paciente.update({ estado: 'Activo' }, {
      where: { id_paciente: req.params.id }
    });
    res.redirect('/pacientes/inactivos');
  } catch (error) {
    console.error('Error al restaurar paciente:', error);
    res.status(500).send('Error al restaurar paciente');
  }
};

// Crear nuevo paciente
exports.crearPaciente = async (req, res) => {
  try {
    await Paciente.create({
      ...req.body,
      estado: 'Activo'
    });
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).send('Error al crear paciente');
  }
};

// Cambiar estado del paciente (toggle entre Activo/Inactivo)
exports.toggleEstado = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    const nuevoEstado = paciente.estado === 'Activo' ? 'Inactivo' : 'Activo';
    paciente.estado = nuevoEstado;
    await paciente.save();

    res.json({ estado: nuevoEstado });
  } catch (error) {
    console.error('Error al cambiar estado del paciente:', error);
    res.status(500).json({ error: 'Error al cambiar estado del paciente' });
  }
};