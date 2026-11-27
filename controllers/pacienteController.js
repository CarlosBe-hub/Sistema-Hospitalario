const Paciente = require('../models/PacienteModel');
const calcularEdad = require('../utils/calcularEdad');
const ObraSocial = require('../models/ObraSocialModel');
const { Op } = require('sequelize');

// Mostrar vista principal de pacientes activos 
const verActivos = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      where: {
        estado: 'Activo',
        es_nn: false,
        dni: { [Op.notLike]: 'NN-%' }
      },
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
    } else if (req.query.error === 'paciente_internado') {
      errorMsg = 'No se puede cambiar el estado a Inactivo: El paciente se encuentra actualmente internado en una habitación.';
    } else if (req.query.error === 'paciente_admitido') {
      errorMsg = 'No se puede cambiar el estado a Inactivo: El paciente posee una admisión activa en curso.';
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

    res.redirect('/pacientes?nuevo=1&success=1');
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).send('Error al crear paciente');
  }
};

const obtenerTodosPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      where: {
        estado: 'Activo',
        es_nn: false,
        dni: { [Op.notLike]: 'NN-%' }
      }
    });
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

    res.render('pacientes/editarPaciente', { paciente, obrasSociales });
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

    if (estado === 'Inactivo') {
      const { Internacion, Admision } = require('../models');

      const internado = await Internacion.findOne({
        where: { id_paciente: id, estado: 'Activa' }
      });
      if (internado) {
        return res.redirect('/pacientes?error=paciente_internado');
      }

      const admitido = await Admision.findOne({
        where: { id_paciente: id, estado: 'activo' }
      });
      if (admitido) {
        return res.redirect('/pacientes?error=paciente_admitido');
      }
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

    if (paciente.estado === 'Activo') {
      const { Internacion, Admision } = require('../models');

      const internado = await Internacion.findOne({
        where: { id_paciente: paciente.id_paciente, estado: 'Activa' }
      });
      if (internado) {
        return res.status(400).json({
          error: 'No se puede desactivar el paciente porque se encuentra actualmente internado.'
        });
      }

      const admitido = await Admision.findOne({
        where: { id_paciente: paciente.id_paciente, estado: 'activo' }
      });
      if (admitido) {
        return res.status(400).json({
          error: 'No se puede desactivar el paciente porque tiene una admisión en curso.'
        });
      }
    }

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
    return res.status(200).json({ existe: !!pacienteExistente });
  } catch (error) {
    console.error('Error validando DNI:', error);
    res.status(500).json({ error: 'Error validando DNI' });
  }
};

// Buscar datos completos de un paciente por DNI 
const buscarPorDNI = async (req, res) => {
  try {
    const { dni } = req.params;
    if (!dni || dni.trim().length < 6) {
      return res.status(400).json({ encontrado: false, error: 'DNI inválido' });
    }

    const paciente = await Paciente.findOne({
      where: {
        dni: dni.trim(),
        es_nn: false
      }
    });

    if (!paciente) {
      return res.status(200).json({ encontrado: false });
    }

    const edad = calcularEdad(paciente.fecha_nacimiento);

    return res.status(200).json({
      encontrado: true,
      paciente: {
        id_paciente: paciente.id_paciente,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        genero: paciente.genero,
        edad: edad !== null ? edad : '',
        telefono: paciente.telefono || '',
        id_obra_social: paciente.id_obra_social || ''
      }
    });
  } catch (error) {
    console.error('Error buscando paciente por DNI:', error);
    res.status(500).json({ encontrado: false, error: 'Error interno al buscar DNI' });
  }
};

// Procesar los datos reales del paciente NN desde el modal flotante
const procesarIdentificacionNN = async (req, res) => {
  const { sequelize, Internacion, Admision } = require('../models');
  const t = await sequelize.transaction();

  try {
    const { nombre, apellido, dni, genero, edad, telefono, id_obra_social } = req.body;
    const { id } = req.params;

    const pacienteNN = await Paciente.findByPk(id, { transaction: t });
    if (!pacienteNN) {
      await t.rollback();
      return res.status(404).send('Registro NN no encontrado.');
    }

    const dniLimpio = dni.trim();
    const obraSocialAsignada = (id_obra_social && id_obra_social !== '') ? parseInt(id_obra_social) : null;

    let fechaNacimiento = null;
    if (edad && !isNaN(parseInt(edad))) {
      const anioNacimiento = new Date().getFullYear() - parseInt(edad);
      fechaNacimiento = new Date(`${anioNacimiento}-01-01`);
    }

    // Verificar si el DNI ya pertenece a un paciente real existente en el sistema
    const pacienteExistente = await Paciente.findOne({
      where: {
        dni: dniLimpio,
        id_paciente: { [Op.ne]: pacienteNN.id_paciente }
      },
      transaction: t
    });

    if (pacienteExistente) {
      await Internacion.update(
        { id_paciente: pacienteExistente.id_paciente },
        { where: { id_paciente: pacienteNN.id_paciente }, transaction: t }
      );

      if (Admision) {
        await Admision.update(
          { id_paciente: pacienteExistente.id_paciente },
          { where: { id_paciente: pacienteNN.id_paciente }, transaction: t }
        );
      }

      // Actualizar datos de contacto obra social si se completaron en el modal
      await pacienteExistente.update({
        telefono: telefono || pacienteExistente.telefono,
        id_obra_social: obraSocialAsignada || pacienteExistente.id_obra_social,
        estado: 'Activo'
      }, { transaction: t });

      // Borrar el registro temporal NN
      await pacienteNN.destroy({ transaction: t });
    } else {
      await pacienteNN.update({
        nombre,
        apellido,
        genero,
        dni: dniLimpio,
        fecha_nacimiento: fechaNacimiento,
        telefono: telefono || null,
        id_obra_social: obraSocialAsignada,
        estado: 'Activo',
        es_nn: false
      }, { transaction: t });
    }

    await t.commit();
    res.redirect('/internacion/listado');
  } catch (error) {
    await t.rollback();
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
  buscarPorDNI,
  procesarIdentificacionNN
};