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

// Ruta para buscar datos completos de un paciente por DNI 
router.get('/buscar-dni/:dni', PacienteController.buscarPorDNI);

// Ruta para validar si el DNI ya existe
router.get('/validar-dni/:dni', PacienteController.validarDNI);

// Ruta para procesar la identificacion desde el modal del listado de internaciones
router.post('/identificar/:id', PacienteController.procesarIdentificacionNN);

module.exports = router;