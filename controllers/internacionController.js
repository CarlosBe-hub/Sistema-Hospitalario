const Internacion = require("../models/InternacionModel");
const Paciente = require("../models/PacienteModel");
const Habitacion = require("../models/HabitacionModel");
const Cama = require("../models/CamaModel");
const Ala = require("../models/AlaModel");
const MotivoInternacion = require("../models/MotivoInternacionModel");
const Admisiones = require("../models/AdmisionModel");
const ObraSocial = require("../models/ObraSocialModel");
const { Op } = require("sequelize");

module.exports = {
  async formNuevaInternacion(req, res) {
    try {
      const alas = await Ala.findAll();
      const habitaciones = await Habitacion.findAll();
      const camas = await Cama.findAll();
      const motivos = await MotivoInternacion.findAll();

      res.render("internacion/internacion", {
        alas,
        habitaciones,
        camas,
        motivos,
        datosPrevios: {},
        error: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar el formulario de internación");
    }
  },

  // Buscar paciente por DNI
  async buscarPacienteDni(req, res) {
    try {
      const { dni } = req.query;

      if (!dni) {
        return res.status(400).json({ error: 'Debe proporcionar un DNI' });
      }

      // Buscamos al paciente y exigimos que tenga una admisión activa
      const paciente = await Paciente.findOne({
        where: { dni: dni.trim(), estado: "Activo" },
        include: [
          {
            model: Admisiones,
            where: { estado: "activo" },
            required: true, 
          },
        ],
      });

      if (paciente) {
        return res.json({ 
          success: true, 
          paciente: {
            id_paciente: paciente.id_paciente,
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            dni: paciente.dni,
            genero: paciente.genero
          } 
        });
      } else {
        return res.json({ 
          success: false, 
          message: 'No se encontró un paciente con ese DNI o no posee una admisión activa.' 
        });
      }
    } catch (error) {
      console.error('Error buscando paciente por DNI:', error);
      res.status(500).json({ error: 'Error interno del servidor al buscar el paciente.' });
    }
  },

  async crearInternacion(req, res) {
    try {
      const { id_paciente, fecha_ingreso, id_habitacion, id_motivo, id_cama } = req.body;

      if (!id_paciente) {
         return await module.exports.renderFormularioConError(res, req.body, "Debe buscar y seleccionar un paciente.");
      }

      const paciente = await Paciente.findByPk(id_paciente);

      // Verificar que el paciente tenga una admisión activa (tolerante a variaciones de caja)
      const admisionActiva = await Admisiones.findOne({
        where: { 
          id_paciente, 
          estado: { [Op.in]: ["Activo", "activo"] } 
        },
      });

      if (!admisionActiva) {
        return await module.exports.renderFormularioConError(res, req.body, "El paciente no tiene una admisión activa.");
      }

      // Verificar conflicto de género
      const internados = await Internacion.findAll({
        where: { id_habitacion, estado: "Activa" },
        include: [{ model: Paciente, as: "Paciente", attributes: ["genero"] }],
      });

      const conflictoGenero =
        internados.length > 0 &&
        internados.some((i) => i.Paciente.genero !== paciente.genero);

      if (conflictoGenero) {
        return await module.exports.renderFormularioConError(res, req.body, "No se puede internar un paciente de género diferente en esta habitación.");
      }

      // Verificar que la cama esté disponible y pertenezca a la habitación
      const cama = await Cama.findByPk(id_cama);
      if (!cama || cama.id_habitacion != id_habitacion) {
        return await module.exports.renderFormularioConError(res, req.body, "La cama seleccionada no pertenece a la habitación elegida.");
      }

      // Pasamos el estado a minúsculas para evitar rechazos por mayúsculas de carga
      const estadoCama = cama.estado ? cama.estado.trim().toLowerCase() : '';
      if (!["libre", "higienizada", "disponible"].includes(estadoCama)) {
        return await module.exports.renderFormularioConError(res, req.body, "La cama seleccionada no está disponible.");
      }

      // Verificar si el paciente ya tiene una internación activa
      const internacionActiva = await Internacion.findOne({
        where: { id_paciente, estado: "Activa" },
        include: [
          {
            model: Cama, as: "Cama",
            include: [{ model: Habitacion, as: "Habitacion", include: [{ model: Ala, as: "Ala" }] }],
          },
        ],
      });

      if (internacionActiva) {
        const camaActual = internacionActiva.Cama;
        const habitacion = camaActual?.Habitacion;
        const ala = habitacion?.Ala;
        const fecha = new Date(internacionActiva.fecha_ingreso).toLocaleDateString();

        const mensaje = `El paciente ya se encuentra internado desde el ${fecha} en la cama ${camaActual?.numero}, habitación ${habitacion?.numero}, ala ${ala?.nombre}.`;
        return await module.exports.renderFormularioConError(res, req.body, mensaje);
      }

      // Crear la internación
      await Internacion.create({
        fecha_ingreso,
        estado: "Activa",
        id_paciente,
        id_habitacion,
        id_motivo: id_motivo || null,
        id_cama,
      });

      // Cambiar estado de la cama a Ocupada
      await cama.update({ estado: "Ocupada" });

      res.redirect("/internacion/listado?success=1");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al crear la internación");
    }
  },

  async listadoInternaciones(req, res) {
    try {
      const internaciones = await Internacion.findAll({
        include: [
          {
            model: Paciente, as: "Paciente", attributes: ["id_paciente", "nombre", "apellido", "dni", "genero"],
          },
          {
            model: Cama, as: "Cama", attributes: ["numero", "estado"],
            include: [{ model: Habitacion, as: "Habitacion", attributes: ["numero"], include: [{ model: Ala, as: "Ala", attributes: ["nombre"] }] }],
          },
          {
            model: MotivoInternacion, as: "MotivoInternacion", attributes: ["descripcion"],
          },
        ],
        order: [["fecha_ingreso", "DESC"]],
      });

      const obrasSociales = await ObraSocial.findAll({ order: [['nombre', 'ASC']] });

      res.render("internacion/internacionListado", { 
        internaciones,
        obrasSociales 
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener el listado de internaciones");
    }
  },

 async renderFormularioConError(res, datosPrevios, error) {
    console.log("INTERNACIÓN RECHAZADA. MOTIVO:", error);
    const alas = await Ala.findAll();
    const habitaciones = await Habitacion.findAll();
    const camas = await Cama.findAll();
    const motivos = await MotivoInternacion.findAll();

    res.render("internacion/internacion", {
      alas,
      habitaciones,
      camas,
      motivos,
      datosPrevios,
      error,
    });
  },
  async anularInternacion(req, res) {
    const { sequelize } = require('../models'); 
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      // Buscar la internación en curso
      const internacion = await Internacion.findByPk(id, { transaction: t });

      if (!internacion) {
        await t.rollback();
        return res.status(404).json({ error: 'La internación especificada no existe.' });
      }

      if (internacion.estado !== 'Activa') {
        await t.rollback();
        return res.status(400).json({ error: 'Operación denegada: Solo se pueden anular internaciones que estén en estado Activa.' });
      }

      // Cambiar estado de la Internación a 'Anulada'
      await internacion.update({ estado: 'Anulada' }, { transaction: t });

      // Buscar la Admisión activa asociada al paciente y cancelarla
      const admision = await Admisiones.findOne({
        where: { 
          id_paciente: internacion.id_paciente,
          estado: { [Op.in]: ['activo', 'Activo'] }
        },
        transaction: t
      });

      if (admision) {
        await admision.update({ estado: 'cancelado' }, { transaction: t });
      }

      // Liberar la cama asociada poniéndola en 'Disponible'
      if (internacion.id_cama) {
        const cama = await Cama.findByPk(internacion.id_cama, { transaction: t });
        if (cama) {
          await cama.update({ estado: 'Disponible' }, { transaction: t });
        }
      }

      // Si se cumplen las 3 operaciones se confirman los cambios 
      await t.commit();
      return res.status(200).json({ message: 'La internación fue anulada y la cama ha sido liberada exitosamente.' });
    } catch (error) {
      await t.rollback();
      console.error('Error al anular la internación:', error);
      return res.status(500).json({ error: 'Error interno del servidor al procesar la anulación hospitalaria.' });
    }
  },
};

