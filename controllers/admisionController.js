const { Paciente } = require('../models');

// Mostrar formulario de admision
exports.mostrarFormulario = (req, res) => {
  res.render('admision');
};

// Guardar nuevo paciente
exports.guardarPaciente = async (req, res) => {
  try {
    await Paciente.create(req.body);
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error al guardar paciente:', error);
    res.status(500).send('Error al guardar paciente');
  }
};