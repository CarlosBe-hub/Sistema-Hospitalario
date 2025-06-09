const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Mostrar vista principal con tabla + modal
router.get('/', admisionController.vistaListado);

// Guardar nueva admisión (POST desde el formulario)
router.post('/guardar', admisionController.guardarAdmision);

// Actualizar admisión (PUT desde formulario con _method=PUT)
router.put('/:id', admisionController.actualizarAdmision);

// Dar de baja una admisión (cambiar estado a cancelado)
router.put('/:id/cancelar', admisionController.darDeBajaAdmision);

// Buscar paciente por DNI (AJAX)
router.get('/buscar-paciente/:dni', admisionController.buscarPacientePorDNI);

module.exports = router;