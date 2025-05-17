const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/pacientes', pacienteController.verActivos);
router.get('/api/pacientes', pacienteController.obtenerTodosPacientes);
router.get('/pacientes/:id/editar', pacienteController.mostrarFormularioEditar);
router.put('/pacientes/:id', pacienteController.actualizarPaciente);
router.delete('/pacientes/:id', pacienteController.eliminarPaciente);

router.get('/pacientes/inactivos', pacienteController.verInactivos);
router.get('/api/pacientes/inactivos', pacienteController.apiInactivos);
router.post('/pacientes/:id/restaurar', pacienteController.restaurarPaciente);

module.exports = router;
