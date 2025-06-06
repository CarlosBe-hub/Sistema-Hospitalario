const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');

// Ruta para actualizar un paciente (PUT con override)
router.put('/:id', PacienteController.actualizarPaciente);

// Ruta para mostrar el formulario de edición
router.get('/:id/editar', PacienteController.mostrarFormularioEditar);

// Ruta para cambiar estado activo/inactivo
router.post('/:id/toggle-estado', PacienteController.toggleEstado);

// Ruta para crear paciente
router.post('/', PacienteController.crearPaciente);

// Ruta para listar
router.get('/', PacienteController.verActivos);

module.exports = router;
