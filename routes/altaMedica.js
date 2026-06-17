const express = require("express");
const router = express.Router();
const AltaMedicaController = require("../controllers/AltaMedicaController");

router.get("/nueva/:id_internacion", AltaMedicaController.formNuevaAlta);


router.post("/crear", AltaMedicaController.crearAlta);

module.exports = router;