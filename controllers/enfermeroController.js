const { 
  Internacion, Paciente, SignosVitales, HistorialMedico, 
  CuidadosEnfermeria, Cama, Habitacion, Enfermero 
} = require('../models');


exports.vistaPacientesInternados = async (req, res) => {
  try {
    // Buscamos a los pacientes que están actualmente en una cama
    const internacionesActivas = await Internacion.findAll({
      include: [
        { model: Paciente, as: 'Paciente' },
        { 
          model: Cama, as: 'Cama',
          include: [{ model: Habitacion, as: 'Habitacion' }]
        }
      ],
      order: [['id_internacion', 'DESC']]
    });

    // Renderizamos la vista de PUG enviando los datos
    res.render('enfermeria/panel_internados', { pacientes: internacionesActivas });
  } catch (error) {
    console.error('Error al cargar panel de enfermería:', error);
    res.status(500).json({ error: 'Error al cargar los pacientes internados' });
  }
};

// Ver el detalle para realizar la evaluación continua
exports.detallePaciente = async (req, res) => {
  try {
    const { id_internacion } = req.params;

    const internacion = await Internacion.findByPk(id_internacion, {
      include: [
        { model: Paciente, as: 'Paciente' },
        { model: HistorialMedico, order: [['id_historial', 'DESC']] },
        { model: SignosVitales, order: [['fecha_registro', 'DESC']] },
        { model: CuidadosEnfermeria, order: [['fecha', 'DESC']] } // Ajustado al nombre de columna 'fecha'
      ]
    });

    if (!internacion) {
      return res.status(404).json({ error: 'Internación no encontrada.' });
    }

    res.render('enfermeria/detalle_evaluacion', { internacion });
  } catch (error) {
    console.error('Error al obtener detalle del paciente:', error);
    res.status(500).json({ error: 'Error al cargar el detalle para enfermería' });
  }
};

// Guardar Historial Medico (Evaluación Inicial)
exports.guardarHistorial = async (req, res) => {
  try {
    const { 
      id_internacion, id_paciente, id_enfermero, enfermedades_previas, 
      cirugias, alergias, medicamentos_actuales, antecedentes_familiares,
      motivo_internacion, sintomas_principales
    } = req.body;

    if (!id_internacion || !id_paciente || !id_enfermero) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (Internación, Paciente o Enfermero).' });
    }

    // El enfermero registra el historial medico, enfermedades previas, alergias, etc.
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
      fecha_registro: new Date()
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

// Registrar Signos Vitales
exports.guardarSignosVitales = async (req, res) => {
  try {
    const { 
      id_internacion, id_paciente, id_enfermero, presion_arterial, 
      frecuencia_cardiaca, frecuencia_respiratoria, temperatura, 
      aspecto_general 
    } = req.body;

    if (!id_internacion || !id_enfermero) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para registrar los signos vitales.' });
    }

    // Se realiza la medición de presión arterial, frecuencia cardíaca, etc. 
    
    const nuevosSignos = await SignosVitales.create({
      id_internacion,
      id_paciente, 
      id_enfermero,
      presion_arterial,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      temperatura,
      aspecto_general,
      fecha_registro: new Date()
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

// Guardar Plan de Cuidados Preliminar
exports.guardarPlanCuidados = async (req, res) => {
  try {
    const { 
      id_internacion, id_paciente, id_enfermero, plan_cuidados, 
      intervenciones, medicamentos_administrados, observaciones 
    } = req.body;

    if (!id_internacion || !id_paciente || !id_enfermero || !plan_cuidados) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para el plan de cuidados.' });
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