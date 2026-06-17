const express = require("express");
const router = express.Router();
const SignosVitalesController = require("../controllers/SignosVitalesController");

// Ruta para mostrar el formulario 
router.get("/nuevo", SignosVitalesController.formNuevoControl);


router.post("/crear", SignosVitalesController.crearControl);

module.exports = router;