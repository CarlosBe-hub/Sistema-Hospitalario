const Paciente = require('../models/PacienteModel');
const calcularEdad = require('../utils/calcularEdad');

const obtenerTodosPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();

    const pacientesConEdad = pacientes.map(p => {
      const edad = calcularEdad(p.fecha_nacimiento);
      const fechaFormateada = new Date(p.fecha_nacimiento).toLocaleDateString('es-ES');
      return {
        ...p.dataValues,
        edad,
        fecha_nacimiento: fechaFormateada
      };
    });

    res.json({ data: pacientesConEdad });
  } catch (error) {
    console.error('Error en /api/pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};

module.exports = {
  obtenerTodosPacientes,
};