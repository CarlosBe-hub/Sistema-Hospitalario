const SignosVitales = require("../models/SignosVitalesModel");
const Internacion = require("../models/InternacionModel");
const Paciente = require("../models/PacienteModel");
const Enfermero = require("../models/EnfermeroModel");

module.exports = {
  // Renderizar el formulario de toma de signos vitales
  async formNuevoControl(req, res) {
    try {
      // Buscamos solo las internaciones activas para saber a quién se le pueden tomar signos
      const internacionesActivas = await Internacion.findAll({
        where: { estado: "Activa" },
        include: [{ model: Paciente, as: "Paciente", attributes: ["nombre", "apellido", "dni"] }]
      });

      // Buscamos los enfermeros activos para el selector del formulario
      const enfermeros = await Enfermero.findAll({
        where: { estado: "Activo" }
      });

      res.render("signosVitalesForm", {
        internacionesActivas,
        enfermeros,
        datosPrevios: {},
        error: null
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar el formulario de signos vitales");
    }
  },

  // Procesar el formulario y guardar en la BD
  async crearControl(req, res) {
    try {
      const {
        id_internacion,
        id_enfermero,
        temperatura,
        frecuencia_cardiaca,
        presion_arterial,
        frecuencia_respiratoria,
        observaciones
      } = req.body;

      // Validaciones básicas de negocio
      if (!id_internacion || !id_enfermero) {
        return await module.exports.renderFormularioConError(
          res,
          req.body,
          "Debe seleccionar una internación válida y un enfermero."
        );
      }

      // Guardamos en la tabla 'signos_vitales'
      await SignosVitales.create({
        fecha_hora: new Date(),
        temperatura: temperatura || null,
        frecuencia_cardiaca: frecuencia_cardiaca || null,
        presion_arterial: presion_arterial || null,
        frecuencia_respiratoria: frecuencia_respiratoria || null,
        observaciones,
        id_internacion,
        id_enfermero
      });

      res.redirect("/internacion/listado");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al registrar los signos vitales");
    }
  },

  // Helper para repoblar el formulario si algo falla
  async renderFormularioConError(res, datosPrevios, error) {
    const internacionesActivas = await Internacion.findAll({
      where: { estado: "Activa" },
      include: [{ model: Paciente, as: "Paciente", attributes: ["nombre", "apellido", "dni"] }]
    });
    const enfermeros = await Enfermero.findAll({ where: { estado: "Activo" } });

    res.render("signosVitalesForm", {
      internacionesActivas,
      enfermeros,
      datosPrevios,
      error
    });
  }
};