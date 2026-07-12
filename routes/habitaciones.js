const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

// Ruta para ver el panel 
router.get('/mapa', habitacionController.getMapaHabitaciones);

// Ruta para el boton de liberar/higienizar la cama
router.post('/liberar/:id_cama', habitacionController.higienizarCama);

// Ruta para obtener las camas de una habitación vía AJAX (para el modal de traslado)
router.get('/:idHabitacion/camas', habitacionController.obtenerCamasPorHabitacion);

module.exports = router;