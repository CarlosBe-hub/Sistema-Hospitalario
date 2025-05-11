const express = require('express');
const router = express.Router();
const { Paciente } = require('../models');

// Vista de tabla
router.get('/pacientes', (req, res) => {
  res.render('pacientes');
});

// API para DataTables
router.get('/api/pacientes', async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json({ data: pacientes });
  } catch (error) {
    console.error('Error en /api/pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

module.exports = router;
