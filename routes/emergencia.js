const express = require('express');
const router = express.Router();
const emergenciaController = require('../controllers/emergenciaController');

router.get('/crear', emergenciaController.vistaFormularioEmergencia);
router.post('/crear', emergenciaController.crearInternacionDeEmergencia);

module.exports = router;
