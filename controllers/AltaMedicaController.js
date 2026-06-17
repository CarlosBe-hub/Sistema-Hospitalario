const AltaMedica = require("../models/AltaMedicaModel");
const Internacion = require("../models/InternacionModel");
const Paciente = require("../models/PacienteModel");
const Cama = require("../models/CamaModel");
const sequelize = require("../config/db"); 

module.exports = {
  //Mostrar el formulario de alta para una internación específica
  async formNuevaAlta(req, res) {
    try {
      const { id_internacion } = req.params;

      // Buscamos la internación con los datos del paciente para mostrarlos en la vista
      const internacion = await Internacion.findByPk(id_internacion, {
        include: [
          { model: Paciente, as: "Paciente", attributes: ["nombre", "apellido", "dni"] },
          { model: Cama, as: "Cama", attributes: ["numero"] }
        ]
      });

      if (!internacion || internacion.estado !== "Activa") {
        return res.status(404).send("La internación no existe o ya fue dada de alta.");
      }

      res.render("altaMedicaForm", {
        internacion,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar el formulario de alta médica");
    }
  },

  // Procesar el alta hospitalaria
  async crearAlta(req, res) {
    const t = await sequelize.transaction(); 
    try {
      const { id_internacion, instrucciones_cuidados } = req.body;

      // Buscar la internación para obtener la cama
      const internacion = await Internacion.findByPk(id_internacion, { transaction: t });
      
      if (!internacion || internacion.estado !== "Activa") {
        await t.rollback();
        return res.status(400).send("La internación no está activa o no es válida.");
      }

      await AltaMedica.create({
        fecha_salida: new Date(),
        estado: "Finalizada",
        instrucciones_cuidados: instrucciones_cuidados || "Sin observaciones particulares.",
        id_internacion
      }, { transaction: t });

      await internacion.update({
        estado: "Finalizada",
        fecha_salida: new Date()
      }, { transaction: t });

      // Liberar la cama (Pasar de 'Ocupada' a 'Disponible' o 'Higienizada')
      if (internacion.id_cama) {
        const cama = await Cama.findByPk(internacion.id_cama, { transaction: t });
        if (cama) {
          await cama.update({ estado: "Disponible" }, { transaction: t });
        }
      }
      await t.commit();
      
      res.redirect("/internacion/listado");
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).send("Error procesar el alta médica del paciente");
    }
  }
};