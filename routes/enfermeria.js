const express = require('express');
const router = express.Router();
const enfermeroController = require('../controllers/enfermeroController');

// Mostrar la tabla de gestión de enfermeros
router.get('/GestionEnfermero', enfermeroController.getGestionEnfermero);

// Crear nuevo enfermero
router.post('/crear', enfermeroController.crearEnfermero);

// Editar enfermero existente
router.post('/editar', enfermeroController.editarEnfermero);

// Cambiar el estado de un enfermero
router.patch('/cambiar-estado', enfermeroController.cambiarEstadoEnfermero);

// Al entrar a enfermeria Panel Principal
router.get('/', enfermeroController.vistaPacientesInternados);

// Rutas para los POST (AJAX)
router.post('/historial', enfermeroController.guardarHistorial);
router.post('/signos-vitales', enfermeroController.guardarSignosVitales);
router.post('/plan-cuidados', enfermeroController.guardarPlanCuidados);

router.get('/:id_internacion', enfermeroController.detallePaciente);

module.exports = router;