const express = require('express');
const router = express.Router();
const InternacionController = require('../controllers/internacionController');

// Menú de internación
router.get('/', (req, res) => {
  res.render('internacionMenu');
});

// Formulario de nueva internación
router.get('/nueva', InternacionController.formNuevaInternacion);

// Crear internación
router.post('/crear', InternacionController.crearInternacion);

// Listado de internaciones
router.get('/listado', InternacionController.listadoInternaciones);

module.exports = router;
