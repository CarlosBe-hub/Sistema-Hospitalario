const Paciente = require('../models/PacienteModel');
const calcularEdad = require('../utils/calcularEdad');
const ObraSocial = require('../models/ObraSocialModel');

// Mostrar vista principal de pacientes activos
const verActivos = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      where: { estado: 'Activo' },
      include: [{ model: ObraSocial, as: 'obraSocial' }]
    });

    const obrasSociales = await ObraSocial.findAll();

    const pacientesProcesados = pacientes.map(p => {
      const edad = calcularEdad(p.fecha_nacimiento);
      return {
        ...p.dataValues,
        edad,
        nombreObraSocial: p.obraSocial ? p.obraSocial.nombre : '',
        fechaISO: p.fecha_nacimiento ? p.fecha_nacimiento.toISOString() : null
      };
    });

    res.render('pacientes', {
      pacientes: pacientesProcesados,
      obrasSociales
    });
  } catch (error) {
    console.error('Error al cargar pacientes activos:', error);
    res.status(500).send('Error al cargar la vista de pacientes');
  }
};

const crearPaciente = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      genero,
      dni,
      altura,
      peso,
      fecha_nacimiento,
      telefono,
      contacto_emergencia,
      direccion,
      estado,
      id_obra_social
    } = req.body;

    const idObraSocial =
      id_obra_social === "null" || id_obra_social === ""
        ? null
        : parseInt(id_obra_social);

    await Paciente.create({
      nombre,
      apellido,
      genero,
      dni,
      altura,
      peso,
      fecha_nacimiento,
      telefono,
      contacto_emergencia,
      direccion,
      estado,
      id_obra_social: idObraSocial
    });

    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).send('Error al crear paciente');
  }
};

const obtenerTodosPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({ where: { estado: 'Activo' } });
    res.json({ data: pacientes });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};

const mostrarFormularioEditar = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).send('Paciente no encontrado');

    const obrasSociales = await ObraSocial.findAll();

    res.render('editarPaciente', { paciente, obrasSociales });
  } catch (error) {
    console.error('Error al mostrar formulario de edición:', error);
    res.status(500).send('Error al mostrar formulario');
  }
};

const actualizarPaciente = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      genero,
      dni,
      altura,
      peso,
      fecha_nacimiento,
      telefono,
      contacto_emergencia,
      direccion,
      estado,
      id_obra_social
    } = req.body;

    const idObraSocial =
      id_obra_social === "null" || id_obra_social === ""
        ? null
        : parseInt(id_obra_social);

    await Paciente.update(
      {
        nombre,
        apellido,
        genero,
        dni,
        altura,
        peso,
        fecha_nacimiento,
        telefono,
        contacto_emergencia,
        direccion,
        estado,
        id_obra_social: idObraSocial
      },
      { where: { id_paciente: req.params.id } }
    );

    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).send('Error al actualizar paciente');
  }
};

const toggleEstado = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    paciente.estado = paciente.estado === 'Activo' ? 'Inactivo' : 'Activo';
    await paciente.save();

    res.json({ estado: paciente.estado });
  } catch (error) {
    console.error('Error al cambiar estado del paciente:', error);
    res.status(500).json({ error: 'Error al cambiar estado del paciente' });
  }
};

module.exports = {
  verActivos,
  obtenerTodosPacientes,
  mostrarFormularioEditar,
  actualizarPaciente,
  toggleEstado,
  crearPaciente
};