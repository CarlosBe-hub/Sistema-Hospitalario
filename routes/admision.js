const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Mostrar vista principal con tabla + modal
router.get('/admision', admisionController.vistaListado);

// Guardar nueva admisión (desde el modal)
router.post('/admision/guardar', admisionController.guardarAdmision);

// Editar una admisión (opcional)
//router.get('/admision/editar/:id', admisionController.editarAdmisionFormulario);
router.post('/admision/editar/:id', admisionController.actualizarAdmision);

// Dar de baja (cambiar estado, opcionalmente registrar motivo)
router.post('/admision/baja/:id', admisionController.darDeBajaAdmision);

module.exports = router;
