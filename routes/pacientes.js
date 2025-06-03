const express = require('express');
const router = express.Router();

// Importar el controlador de pacientes
const pacienteController = require('../controllers/pacienteController');

// Crear paciente
router.post('/', pacienteController.crearPaciente);

// Ver pacientes activos
router.get('/', pacienteController.verActivos);

// API: obtener todos los pacientes (podés mover esto a otro router si es estrictamente para API)
router.get('/api', pacienteController.obtenerTodosPacientes);

// Mostrar formulario de edición
router.get('/:id/editar', pacienteController.mostrarFormularioEditar);

// Actualizar paciente
router.post('/:id/editar', pacienteController.actualizarPaciente);

// Cambiar estado (activar/desactivar)
router.post('/:id/toggle-estado', pacienteController.toggleEstado);

module.exports = router;