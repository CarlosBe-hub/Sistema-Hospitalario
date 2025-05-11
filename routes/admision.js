const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

router.get('/admision', admisionController.mostrarFormulario);
router.post('/admision', admisionController.guardarPaciente);

module.exports = router;