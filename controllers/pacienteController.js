const Paciente = require('../models/PacienteModel');
const calcularEdad = require('../utils/calcularEdad');

// Mostrar vista principal de pacientes activos
exports.verActivos = (req, res) => {
  res.render('pacientes');
};

// Mostrar todos los pacientes activos (para DataTable)
exports.obtenerTodosPacientes = async (req, res) => {
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
};

// Mostrar formulario de edición
exports.mostrarFormularioEditar = async (req, res) => {
  const paciente = await Paciente.findByPk(req.params.id);
  if (!paciente) return res.status(404).send('Paciente no encontrado');
  res.render('editarPaciente', { paciente });
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
  await Paciente.update({ estado: 'Inactivo' }, {
    where: { id_paciente: req.params.id }
  });
  res.redirect('/pacientes');
};

// Ver lista de pacientes inactivos
exports.verInactivos = (req, res) => {
  res.render('pacientesInactivos');
};

// API: obtener pacientes inactivos para DataTable
exports.apiInactivos = async (req, res) => {
  const pacientes = await Paciente.findAll({ where: { estado: 'Inactivo' } });

  const pacientesProcesados = pacientes.map(p => ({
    ...p.dataValues,
    fecha_nacimiento: p.fecha_nacimiento
      ? new Date(p.fecha_nacimiento).toLocaleDateString('es-ES')
      : ''
  }));

  res.json({ data: pacientesProcesados });
};

// Restaurar paciente (cambiar estado a Activo)
exports.restaurarPaciente = async (req, res) => {
  await Paciente.update({ estado: 'Activo' }, {
    where: { id_paciente: req.params.id }
  });
  res.redirect('/pacientes/inactivos');
};