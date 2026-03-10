const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

// Mostrar panel principal con la lista de pacientes internados activos
router.get('/', medicoController.vistaPacientesInternados);

// Ver el detalle de la historia clínica de una internación específica
router.get('/:id_internacion', medicoController.detallePaciente);

// Guardar Evaluación Médica y Diagnóstico (POST desde formulario o AJAX)
router.post('/diagnostico', medicoController.guardarDiagnostico);

// Guardar un nuevo Tratamiento o Indicación Médica (POST)
router.post('/tratamiento', medicoController.guardarTratamiento);

// Dar el Alta Hospitalaria al paciente (POST)
router.post('/alta', medicoController.darAlta);

module.exports = router;