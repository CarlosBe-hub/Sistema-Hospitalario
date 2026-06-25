const express = require('express');
const router = express.Router();
const InternacionController = require('../controllers/internacionController');

// Menú de internación
router.get('/', (req, res) => {
  res.render('internacionMenu');
});

// Formulario de nueva internación
router.get('/nueva', InternacionController.formNuevaInternacion);

router.get('/buscarPaciente', InternacionController.buscarPacienteDni);

// Crear internación
router.post('/crear', InternacionController.crearInternacion);

// Listado de internaciones
router.get('/listado', InternacionController.listadoInternaciones);

// Anular internación vía AJAX
router.put('/:id/anular', InternacionController.anularInternacion);

module.exports = router;
