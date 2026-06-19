const Paciente = require('../models/PacienteModel');
const calcularEdad = require('../utils/calcularEdad');
const ObraSocial = require('../models/ObraSocialModel');
const { Op } = require('sequelize');

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
    let errorMsg = null;
    if (req.query.error === 'dni') {
      errorMsg = 'El DNI ingresado ya se encuentra registrado por otro paciente.';
    } else if (req.query.error === 'dni_edicion') {
      errorMsg = 'No se puede actualizar: El DNI ya pertenece a otro paciente.';
    } else if (req.query.error === 'campos_obligatorios') {
      errorMsg = 'Faltan campos obligatorios para registrar al paciente.';
    }

    res.render('pacientes/pacientes', {
      pacientes: pacientesProcesados,
      obrasSociales,
      errorMsg,
      query: req.query
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

    if (!nombre || !apellido || !dni) {
      return res.redirect('/pacientes?nuevo=1&error=campos_obligatorios');
    }

    // Verificar si ya existe un paciente con ese DNI
    const pacienteExistente = await Paciente.findOne({ where: { dni: dni.trim() } });

    if (pacienteExistente) {
      return res.redirect('/pacientes?nuevo=1&error=dni');
    }

    const idObraSocial =
      id_obra_social === "null" || id_obra_social === ""
        ? null
        : parseInt(id_obra_social);

    await Paciente.create({
      nombre,
      apellido,
      genero,
      dni: dni.trim(),
      altura: altura ? parseFloat(altura) : null,
      peso: peso ? parseFloat(peso) : null,
      fecha_nacimiento: fecha_nacimiento || null,
      telefono,
      contacto_emergencia,
      direccion,
      estado: estado || 'Activo',
      id_obra_social: idObraSocial
    });

    // Redirigir sin error pero con abrir modal para limpiar form 
    res.redirect('/pacientes?nuevo=1&success=1');
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
    const { id } = req.params;
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

    const dniRepetido = await Paciente.findOne({
      where: {
        dni: dni.trim(),
        id_paciente: { [Op.ne]: id } 
      }
    });

    if (dniRepetido) {
      return res.redirect('/pacientes?error=dni_edicion');
    }

    const idObraSocial =
      id_obra_social === "null" || id_obra_social === ""
        ? null
        : parseInt(id_obra_social);

    await Paciente.update(
      {
        nombre,
        apellido,
        genero,
        dni: dni.trim(),
        altura: altura ? parseFloat(altura) : null,
        peso: peso ? parseFloat(peso) : null,
        fecha_nacimiento: fecha_nacimiento || null,
        telefono,
        contacto_emergencia,
        direccion,
        estado,
        id_obra_social: idObraSocial
      },
      { where: { id_paciente: id } }
    );

    res.redirect('/pacientes?success_edit=1');
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

// Validar si un DNI ya existe 
const validarDNI = async (req, res) => {
  try {
    const { dni } = req.params;
    if (!dni || dni.length < 6) {
      return res.status(400).json({ error: 'DNI inválido' });
    }

    const pacienteExistente = await Paciente.findOne({ where: { dni: dni.trim() } });

    if (pacienteExistente) {
      return res.status(200).json({ existe: true });
    } else {
      return res.status(200).json({ existe: false });
    }
  } catch (error) {
    console.error('Error validando DNI:', error);
    res.status(500).json({ error: 'Error validando DNI' });
  }
};

// Procesar los datos reales del paciente NN desde el modal flotante
const procesarIdentificacionNN = async (req, res) => {
  try {
    const { nombre, apellido, dni, genero, edad, telefono, id_obra_social } = req.body; 
    const { id } = req.params;

    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
      return res.status(404).send('Paciente no encontrado.');
    }

    // Validar que el DNI real ingresado no exista ya en otro paciente
    const dniExistente = await Paciente.findOne({ where: { dni: dni.trim() } });
    if (dniExistente) {
      return res.redirect('/internacion/listado?error=dni_duplicado');
    }

    // Calculamos una fecha de nacimiento aproximada
    let fechaNacimiento = null;
    if (edad && !isNaN(parseInt(edad))) {
      const anioNacimiento = new Date().getFullYear() - parseInt(edad);
      fechaNacimiento = new Date(`${anioNacimiento}-01-01`);
    }

    // Parseamos el ID de la obra social
    const obraSocialAsignada = (id_obra_social && id_obra_social !== "") ? parseInt(id_obra_social) : null;

    await paciente.update({
      nombre,
      apellido,
      genero,
      dni: dni.trim(),
      fecha_nacimiento: fechaNacimiento,
      telefono: telefono || null,
      id_obra_social: obraSocialAsignada, 
      estado: 'Activo'
    });

    res.redirect('/internacion/listado');
  } catch (error) {
    console.error('Error al identificar paciente NN:', error);
    res.status(500).send('Error al procesar la identificación del paciente.');
  }
};

module.exports = {
  verActivos,
  obtenerTodosPacientes,
  mostrarFormularioEditar,
  actualizarPaciente,
  toggleEstado,
  crearPaciente,
  validarDNI,
  procesarIdentificacionNN
};