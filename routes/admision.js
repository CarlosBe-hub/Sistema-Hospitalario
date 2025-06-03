const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Mostrar vista principal con tabla + modal
router.get('/', admisionController.vistaListado);

// Guardar nueva admisión (desde el modal)
router.post('/guardar', admisionController.guardarAdmision);

// Actualizar una admisión existente
router.post('/editar/:id', admisionController.actualizarAdmision);

// Dar de baja (cambiar estado a "cancelado")
router.post('/baja/:id', admisionController.darDeBajaAdmision);

// Buscar paciente por DNI (AJAX)
router.get('/buscar-paciente/:dni', admisionController.buscarPacientePorDNI);

module.exports = router;
