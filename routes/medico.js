const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');


// Mostrar panel principal con la lista de pacientes internados activos
router.get('/', medicoController.vistaPacientesInternados);


// Ver el listado global de todas las internaciones finalizadas
router.get('/historial', medicoController.vistaHistorial);

// Ver el detalle completo e histórico de una internación pasada
router.get('/historial/:id_internacion', medicoController.detalleHistorial);


// Ver el detalle de la historia clínica de una internación específica activa
router.get('/:id_internacion', medicoController.detallePaciente);

// Guardar Evaluación Médica y Diagnóstico
router.post('/diagnostico', medicoController.guardarDiagnostico);

// Guardar un nuevo Tratamiento o Indicación Médica
router.post('/tratamiento', medicoController.guardarTratamiento);

// Dar el Alta Hospitalaria al paciente
router.post('/alta', medicoController.darAlta);

module.exports = router;