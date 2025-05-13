const { Paciente, Habitacion, Admision } = require('../models');
const calcularEdad = require('../utils/calcularEdad');
// Mostrar formulario de admisión
exports.mostrarFormulario = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    const habitaciones = await Habitacion.findAll({ where: { estado: 'Disponible' } });

    res.render('admision', { pacientes, habitaciones });
  } catch (error) {
    console.error('Error al mostrar formulario de admisión:', error);
    res.status(500).send('Error al cargar el formulario de admisión');
  }
};

// Guardar nueva admisión
exports.guardarAdmision = async (req, res) => {
  try {
    await Admision.create(req.body);
    res.redirect('/pacientes'); // o /admisiones si tenés esa vista
  } catch (error) {
    console.error('Error al guardar admisión:', error);
    res.status(500).send('Error al guardar la admisión');
  }
};