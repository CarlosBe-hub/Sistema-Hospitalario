const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Ver pacientes
router.get('/pacientes', pacienteController.verActivos);
router.get('/pacientes/inactivos', pacienteController.verInactivos);
router.get('/api/pacientes', pacienteController.obtenerTodosPacientes);
router.get('/api/pacientes/inactivos', pacienteController.apiInactivos);

// Crear paciente
router.post('/pacientes', pacienteController.crearPaciente);

// Editar y eliminar
router.get('/pacientes/:id/editar', pacienteController.mostrarFormularioEditar);
router.put('/pacientes/:id', pacienteController.actualizarPaciente);
router.delete('/pacientes/:id', pacienteController.eliminarPaciente);

// Restaurar inactivo
router.post('/pacientes/:id/restaurar', pacienteController.restaurarPaciente);

// Cambiar estado (Activo <-> Inactivo)
router.post('/pacientes/:id/toggle-estado', pacienteController.toggleEstado);

module.exports = router;