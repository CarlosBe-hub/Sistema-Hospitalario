const express = require('express');
const router = express.Router();
const enfermeroController = require('../controllers/enfermeroController');

// Mostrar panel principal con los pacientes para evaluación de enfermería
router.get('/', enfermeroController.vistaPacientesInternados);

// Ver el detalle del paciente para cargar evaluaciones continuas
router.get('/:id_internacion', enfermeroController.detallePaciente);

// Guardar Historial Médico / Antecedentes (POST)
router.post('/historial', enfermeroController.guardarHistorial);

// Registrar nuevos Signos Vitales (POST)
router.post('/signos-vitales', enfermeroController.guardarSignosVitales);

// Guardar Plan de Cuidados Preliminar o intervenciones (POST)
router.post('/plan-cuidados', enfermeroController.guardarPlanCuidados);

module.exports = router;