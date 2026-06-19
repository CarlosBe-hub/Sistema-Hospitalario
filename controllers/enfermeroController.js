const { 
  Internacion, Paciente, SignosVitales, HistorialMedico, 
  CuidadosEnfermeria, Cama, Habitacion, Enfermero 
} = require('../models');
const { Op } = require('sequelize');

// Mostrar panel con pacientes internados
exports.vistaPacientesInternados = async (req, res) => {
  try {
    const internacionesActivas = await Internacion.findAll({
      where: { estado: 'Activa' }, 
      include: [
        { model: Paciente, as: 'Paciente' },
        { 
          model: Cama, as: 'Cama',
          include: [{ model: Habitacion, as: 'Habitacion' }]
        },
        { model: SignosVitales } 
      ],
      order: [['id_internacion', 'DESC']]
    });

    res.render('enfermeria/panel_internados', { pacientes: internacionesActivas });
  } catch (error) {
    console.error('Error al cargar panel de enfermería:', error);
    res.status(500).json({ error: 'Error al cargar los pacientes internados' });
  }
};

// Detalle para evaluación
exports.detallePaciente = async (req, res) => {
  try {
    const { id_internacion } = req.params;

    const internacion = await Internacion.findByPk(id_internacion, {
      include: [
        { model: Paciente, as: 'Paciente' },
        { model: HistorialMedico },
        { model: SignosVitales },
        { model: CuidadosEnfermeria }
      ]
    });

    if (!internacion) {
      return res.status(404).json({ error: 'Internación no encontrada.' });
    }

    res.render('enfermeria/detalle_evaluacion', { internacion });
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    res.status(500).json({ error: 'Error al cargar el detalle' });
  }
};

// Historial Médico Inicial
exports.guardarHistorial = async (req, res) => {
  try {
    const { 
      id_internacion, id_paciente, id_enfermero, enfermedades_previas, 
      cirugias, alergias, medicamentos_actuales, antecedentes_familiares,
      motivo_internacion, sintomas_principales
    } = req.body;

    if (!id_internacion || !id_paciente || !id_enfermero) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const nuevoHistorial = await HistorialMedico.create({
      id_internacion,
      id_paciente, 
      id_enfermero,
      enfermedades_previas,
      cirugias,
      alergias,
      medicamentos_actuales,
      antecedentes_familiares,
      motivo_internacion,
      sintomas_principales,
      fecha: new Date(), 
      diagnostico: null,  
      id_medico: null     
    });

    res.status(200).json({ 
      mensaje: 'Historial médico inicial registrado correctamente.',
      historial: nuevoHistorial
    });
  } catch (error) {
    console.error('Error al guardar historial:', error);
    res.status(500).json({ error: 'Error al registrar el historial médico' });
  }
};

// Control de Signos Vitales
exports.guardarSignosVitales = async (req, res) => {
  try {
    const { 
      id_internacion, id_paciente, id_enfermero, presion_arterial, 
      frecuencia_cardiaca, frecuencia_respiratoria, temperatura, 
      aspecto_general 
    } = req.body;

    if (!id_internacion || !id_enfermero) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const nuevosSignos = await SignosVitales.create({
      id_internacion,
      id_paciente, 
      id_enfermero,
      presion_arterial,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      temperatura,
      aspecto_general,
      fecha_hora: new Date() 
    });

    res.status(200).json({ 
      mensaje: 'Signos vitales registrados correctamente.',
      signos: nuevosSignos
    });
  } catch (error) {
    console.error('Error al guardar signos vitales:', error);
    res.status(500).json({ error: 'Error al registrar los signos vitales' });
  }
};

// Plan de Cuidados Clínicos
exports.guardarPlanCuidados = async (req, res) => {
  try {
    const { 
      id_internacion, id_paciente, id_enfermero, plan_cuidados, 
      intervenciones, medicamentos_administrados, observaciones 
    } = req.body;

    if (!id_internacion || !id_paciente || !id_enfermero || !plan_cuidados) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const nuevoCuidado = await CuidadosEnfermeria.create({
      id_internacion,
      id_paciente,
      id_enfermero,
      plan_cuidados,
      intervenciones,
      medicamentos_administrados,
      observaciones,
      fecha: new Date()
    });

    res.status(200).json({ 
      mensaje: 'Plan de cuidados registrado exitosamente.',
      cuidado: nuevoCuidado
    });
  } catch (error) {
    console.error('Error al guardar plan de cuidados:', error);
    res.status(500).json({ error: 'Error al registrar el plan de cuidados' });
  }
};

// Renderizar panel principal del Admin
exports.getGestionEnfermero = async (req, res) => {
  try {
    const enfermeros = await Enfermero.findAll({
      order: [['id_enfermero', 'DESC']]
    });

    res.render('enfermeria/gestionEnfermero', { 
      enfermeros,
      success: req.query.success === '1'
    });
  } catch (error) {
    console.error('Error al obtener la gestión de enfermeros:', error);
    res.status(500).send('Error al cargar el panel de administración de enfermeros.');
  }
};

// Procesar la creación de un nuevo Enfermero 
exports.crearEnfermero = async (req, res) => {
  try {
    const { nombre, apellido, dni, nro_matricula } = req.body;

    const existeMatricula = await Enfermero.findOne({ where: { nro_matricula } });
    if (existeMatricula) {
      const enfermeros = await Enfermero.findAll({ order: [['id_enfermero', 'DESC']] });
      return res.render('enfermero/gestionEnfermero', {
        enfermeros,
        errorMsg: `La matrícula '${nro_matricula}' ya está registrada por otro enfermero.`
      });
    }

    const existeDni = await Enfermero.findOne({ where: { dni } });
    if (existeDni) {
      const enfermeros = await Enfermero.findAll({ order: [['id_enfermero', 'DESC']] });
      return res.render('enfermero/gestionEnfermero', {
        enfermeros,
        errorMsg: `El DNI '${dni}' ya pertenece a un enfermero del sistema.`
      });
    }

    await Enfermero.create({
      nombre,
      apellido,
      dni, 
      nro_matricula,
      estado: 'Activo'
    });

    res.redirect('/enfermeria/GestionEnfermero?success=1');
  } catch (error) {
    console.error('Error al guardar el nuevo enfermero:', error);
    res.status(500).send('Error interno del servidor al crear el enfermero.');
  }
};

// Hacer la edición de un Enfermero existente
exports.editarEnfermero = async (req, res) => {
  try {
    const { id_enfermero, nombre, apellido, dni, nro_matricula } = req.body;

    const dniRepetido = await Enfermero.findOne({ 
      where: { dni, id_enfermero: { [Op.ne]: id_enfermero } } 
    });
    if (dniRepetido) {
      const enfermeros = await Enfermero.findAll({ order: [['id_enfermero', 'DESC']] });
      return res.render('enfermero/gestionEnfermero', {
        enfermeros,
        errorMsg: `El DNI '${dni}' ya está registrado por otro enfermero.`
      });
    }

    const matriculaRepetida = await Enfermero.findOne({ 
      where: { nro_matricula, id_enfermero: { [Op.ne]: id_enfermero } } 
    });
    if (matriculaRepetida) {
      const enfermeros = await Enfermero.findAll({ order: [['id_enfermero', 'DESC']] });
      return res.render('enfermero/gestionEnfermero', {
        enfermeros,
        errorMsg: `La matrícula '${nro_matricula}' ya pertenece a otro enfermero.`
      });
    }

    await Enfermero.update({
      nombre,
      apellido,
      dni,
      nro_matricula
    }, {
      where: { id_enfermero }
    });

    res.redirect('/enfermeria/GestionEnfermero?success=1');
  } catch (error) {
    console.error('Error al actualizar enfermero:', error);
    res.status(500).send('Error interno al editar el enfermero.');
  }
};

// Cambiar el estado 
exports.cambiarEstadoEnfermero = async (req, res) => {
  try {
    const { id_enfermero, nuevo_estado } = req.body;

    await Enfermero.update(
      { estado: nuevo_estado },
      { where: { id_enfermero } }
    );

    res.redirect('/enfermeria/GestionEnfermero');
  } catch (error) {
    console.error('Error al cambiar estado del enfermero:', error);
    res.status(500).send('Error interno al procesar el estado del profesional.');
  }
};