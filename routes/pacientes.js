const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.post('/pacientes', pacienteController.crearPaciente);

// Ver pacientes
router.get('/pacientes', pacienteController.verActivos);


// API: obtener todos los pacientes
router.get('/api/pacientes', pacienteController.obtenerTodosPacientes);


// Editar paciente
router.get('/pacientes/:id/editar', pacienteController.mostrarFormularioEditar);
router.post('/pacientes/:id/editar', pacienteController.actualizarPaciente);


// Cambiar estado
router.post('/pacientes/:id/toggle-estado', pacienteController.toggleEstado);

module.exports = router;