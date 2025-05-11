const express = require('express');
const router = express.Router();
const { Paciente } = require('../models');


router.get('/admision', (req, res) => {
  res.render('admision');
});


router.post('/admision', async (req, res) => {
  try {
    await Paciente.create(req.body);
    res.redirect('/pacientes'); // luego de guardar, volver al listado
  } catch (error) {
    console.error('Error al guardar paciente:', error);
    res.status(500).send('Error al guardar paciente');
  }
});

module.exports = router;