const express = require('express');
const router = express.Router();
const enfermeroController = require('../controllers/enfermeroController');
const checkRole = require('../middlewares/authRole');

// RUTAS EXCLUSIVAS DE ADMINISTRADOR

router.get('/GestionEnfermero', checkRole('admin'), enfermeroController.getGestionEnfermero);
router.post('/crear', checkRole('admin'), enfermeroController.crearEnfermero);
router.post('/editar', checkRole('admin'), enfermeroController.editarEnfermero);
router.patch('/cambiar-estado', checkRole('admin'), enfermeroController.cambiarEstadoEnfermero);

// RUTAS CLÍNICAS (ENFERMEROS Y ADMIN)

// Panel Principal de enfermería
router.get('/', enfermeroController.vistaPacientesInternados);

// Rutas para los POST (AJAX)
router.post('/historial', enfermeroController.guardarHistorial);
router.post('/signos-vitales', enfermeroController.guardarSignosVitales);
router.post('/plan-cuidados', enfermeroController.guardarPlanCuidados);
router.post('/alergia', enfermeroController.guardarAlergiaPaciente);

// Detalle de evaluación de enfermería del paciente
router.get('/:id_internacion', enfermeroController.detallePaciente);

module.exports = router;