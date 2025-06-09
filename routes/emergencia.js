const express = require('express');
const router = express.Router();
const emergenciaController = require('../controllers/emergenciaController');
// Ruta para crear un paciente NN
router.get('/crear', emergenciaController.vistaFormularioEmergencia);
router.post('/crear', emergenciaController.crearInternacionDeEmergencia);

module.exports = router;
