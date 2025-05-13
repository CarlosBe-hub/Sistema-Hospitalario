const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/pacientes', (req, res) => {
  res.render('pacientes');
});

router.get('/api/pacientes', pacienteController.obtenerTodosPacientes);

module.exports = router;