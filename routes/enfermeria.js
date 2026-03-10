const express = require('express');
const router = express.Router();
const enfermeroController = require('../controllers/enfermeroController');

// Al entrar a /enfermeria
router.get('/', enfermeroController.vistaPacientesInternados);

// Al entrar a /enfermeria/ID_DE_LA_INTERNACION
router.get('/:id_internacion', enfermeroController.detallePaciente);

// Rutas para los POST (AJAX)
router.post('/historial', enfermeroController.guardarHistorial);
router.post('/signos-vitales', enfermeroController.guardarSignosVitales);
router.post('/plan-cuidados', enfermeroController.guardarPlanCuidados);

module.exports = router;