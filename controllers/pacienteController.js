const Paciente = require ('../models/PacienteModel')

const obtenerTodosPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json({ data: pacientes });
  } catch (error) {
    console.error('Error en /api/pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
}

module.exports = {
    obtenerTodosPacientes,
}