const { 
  Internacion, Paciente, Diagnostico, Tratamiento, 
  AltaMedica, SignosVitales, Cama, Habitacion, Medico
} = require('../models');
const { Op } = require('sequelize');

// Mostrar panel principal con pacientes internados
exports.vistaPacientesInternados = async (req, res) => {
  try {
    // Buscamos las internaciones incluyendo su estado de alta
    const internacionesActivas = await Internacion.findAll({
      include: [
        { model: Paciente, as: 'Paciente' },
        { 
          model: Cama, as: 'Cama',
          include: [{ model: Habitacion, as: 'Habitacion' }]
        },
        { model: AltaMedica }
      ],
      order: [['id_internacion', 'DESC']]
    });

    // Filtramos solo los pacientes que no han sido dados de alta
    const pacientesEnCama = internacionesActivas.filter(int => !int.AltaMedica);

    // Renderizamos la vista usando PUG
    res.render('medico/panel_internados', { pacientes: pacientesEnCama });
  } catch (error) {
    console.error('Error al cargar panel médico:', error);
    res.status(500).json({ error: 'Error al cargar los pacientes internados' });
  }
};

// Ver la historia clínica detallada de la internación actual
exports.detallePaciente = async (req, res) => {
  try {
    const { id_internacion } = req.params;

    const internacion = await Internacion.findByPk(id_internacion, {
      include: [
        { model: Paciente, as: 'Paciente' },
        { model: SignosVitales }, 
        { model: Diagnostico, include: [{ model: Medico }] },
        { model: Tratamiento, include: [{ model: Medico }] },
        { 
          model: Cama, 
          as: 'Cama',
          include: [{ model: Habitacion, as: 'Habitacion' }]
        }
      ],
      order: [
        [SignosVitales, 'id_signos', 'DESC'],
        [Diagnostico, 'fecha', 'DESC'], 
        [Tratamiento, 'fecha_indicacion', 'DESC']
      ]
    });

    if (!internacion) {
      return res.status(404).json({ error: 'Internación no encontrada.' });
    }

    res.render('medico/detalle_clinico', { internacion });
  } catch (error) {
    console.error('Error al obtener detalle del paciente:', error);
    res.status(500).json({ error: 'Error al cargar el detalle clínico' });
  }
};

// Guardar Evaluación Medica y Diagnostico
exports.guardarDiagnostico = async (req, res) => {
  try {
    const { id_internacion, id_paciente, id_medico, descripcion, pruebas_solicitadas } = req.body;

    // Validamos que no falten datos obligatorios
    if (!id_internacion || !id_paciente || !id_medico || !descripcion) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para registrar el diagnóstico.' });
    }

    // Insertamos usando las columnas exactas de tu base de datos
    const nuevoDiagnostico = await Diagnostico.create({
      id_internacion,
      id_paciente, 
      id_medico,
      descripcion,
      pruebas_solicitadas: pruebas_solicitadas || 'Ninguna',
      fecha: new Date() 
    });

    res.status(200).json({ 
      mensaje: 'Evaluación médica y diagnóstico registrados correctamente.',
      diagnostico: nuevoDiagnostico
    });
  } catch (error) {
    console.error('Error al guardar diagnóstico:', error);
    res.status(500).json({ error: 'Error al registrar el diagnóstico' });
  }
};

// Guardar un nuevo Tratamiento o Indicacion Medica
exports.guardarTratamiento = async (req, res) => {
  try {
    const { 
      id_internacion, id_medico, terapias_procedimientos, 
      medicamentos_dosis, control_dolor, observaciones_evolucion 
    } = req.body;

    if (!id_internacion || !id_medico) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para indicar el tratamiento.' });
    }

    const nuevoTratamiento = await Tratamiento.create({
      id_internacion,
      id_medico,
      terapias_procedimientos: terapias_procedimientos || null,
      medicamentos_dosis: medicamentos_dosis || null,
      control_dolor: control_dolor || null,
      observaciones_evolucion: observaciones_evolucion || null,
      fecha_indicacion: new Date()
    });

    res.status(200).json({ 
      mensaje: 'Indicaciones medicas y tratamiento guardados correctamente.',
      treatment: nuevoTratamiento
    });
  } catch (error) {
    console.error('Error al guardar tratamiento:', error);
    res.status(500).json({ error: 'Error al registrar el tratamiento' });
  }
};

// Dar el Alta Hospitalaria (Mapeado a la nueva estructura de la base de datos)
exports.darAlta = async (req, res) => {
  try {
    const { 
      id_internacion, id_medico, instrucciones_cuidado, 
      recetas_medicas, recommendations_seguimiento 
    } = req.body;

    if (!id_internacion || !id_medico) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para proceder con el alta.' });
    }

    const internacion = await Internacion.findByPk(id_internacion);
    if (!internacion) {
      return res.status(404).json({ error: 'Internación no encontrada.' });
    }

    // Concatenamos las cadenas del formulario web para rellenar de forma rica 'instrucciones_cuidados'
    const todasLasInstrucciones = `
      Cuidados: ${instrucciones_cuidado || 'Sin indicaciones particulares'}. 
      Recetas: ${recetas_medicas || 'Ninguna'}. 
      Seguimiento: ${recommendations_seguimiento || 'Control por consultorio externo'}.
    `.trim();

    // Insertamos siguiendo la estructura estricta y actualizada de tu MySQL
    const nuevaAlta = await AltaMedica.create({
      id_internacion,
      id_medico,               
      fecha_salida: new Date(), 
      estado: 'Finalizado',     
      instrucciones_cuidados: todasLasInstrucciones
    });

    // Liberar la cama para que pueda ser asignada a un nuevo paciente
    if (internacion.id_cama) {
      const cama = await Cama.findByPk(internacion.id_cama);
      if (cama) {
        await cama.update({ estado: 'para_limpieza' }); 
      }
    }

    res.status(200).json({ 
      mensaje: 'Alta hospitalaria procesada exitosamente. La cama ahora debe ser higienizada.',
      alta: nuevaAlta
    });
  } catch (error) {
    console.error('Error al dar de alta:', error);
    res.status(500).json({ error: 'Error al procesar el alta médica' });
  }
};