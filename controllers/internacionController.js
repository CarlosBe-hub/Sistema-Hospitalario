const Internacion = require('../models/InternacionModel');
const Paciente = require('../models/PacienteModel');
const Habitacion = require('../models/HabitacionModel');
const Cama = require('../models/CamaModel');
const Ala = require('../models/AlaModel');
const MotivoInternacion = require('../models/MotivoInternacionModel');
const Admisiones = require('../models/AdmisionModel');  
const { Op } = require('sequelize');


module.exports = {
  async formNuevaInternacion(req, res) {
    try {
      const pacientes = await Paciente.findAll({
        where: { estado: 'Activo' },
        include: [{
          model: Admisiones,
          where: { estado: 'activo' },
          required: true
        }]
      });

      const alas = await Ala.findAll();
      const habitaciones = await Habitacion.findAll();
      const camas = await Cama.findAll();
      const motivos = await MotivoInternacion.findAll();

      res.render('internacion', {
        pacientes,
        alas,
        habitaciones,
        camas,
        motivos,
        datosPrevios: {},
        error: null
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el formulario de internación');
    }
  },



  async crearInternacion(req, res) {
    try {
      const { id_paciente, fecha_ingreso, id_habitacion, id_motivo, id_cama } = req.body;

      const paciente = await Paciente.findByPk(id_paciente);

      // Verificar que el paciente tenga una admisión activa
      const admisionActiva = await Admisiones.findOne({
        where: {
          id_paciente,
          estado: 'Activo'
        }
      });

      if (!admisionActiva) {
        return await module.exports.renderFormularioConError(
          res,
          req.body,
          'El paciente no tiene una admisión activa.'
        );
      }

      // Verificar conflicto de género
      const internados = await Internacion.findAll({
        where: {
          id_habitacion,
          estado: 'Activa'
        },
        include: [{ model: Paciente, as: 'Paciente', attributes: ['genero'] }]
      });

      const conflictoGenero =
        internados.length > 0 &&
        internados.some(i => i.Paciente.genero !== paciente.genero);

      if (conflictoGenero) {
        return await module.exports.renderFormularioConError(
          res,
          req.body,
          'No se puede internar un paciente de género diferente en esta habitación.'
        );
      }

      // Verificar que la cama esté disponible y pertenezca a la habitación
      const cama = await Cama.findByPk(id_cama);
      if (!cama || cama.id_habitacion != id_habitacion) {
        return await module.exports.renderFormularioConError(
          res,
          req.body,
          'La cama seleccionada no pertenece a la habitación elegida.'
        );
      }

      if (!['Libre', 'Higienizada', 'Disponible'].includes(cama.estado)) {
        return await module.exports.renderFormularioConError(
          res,
          req.body,
          'La cama seleccionada no está disponible.'
        );
      }

      // Crear la internación
      await Internacion.create({
        fecha_ingreso,
        estado: 'Activa',
        id_paciente,
        id_habitacion,
        id_motivo: id_motivo || null,
        id_cama
      });

      // Cambiar estado de la cama a Ocupada
      await cama.update({ estado: 'Ocupada' });

      res.redirect('/internacion/listado');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear la internación');
    }
  },

  async listadoInternaciones(req, res) {
    try {
      const internaciones = await Internacion.findAll({
        include: [
          {
            model: Paciente,
            as: 'Paciente',
            attributes: ['nombre', 'apellido', 'dni', 'genero']
          },
          {
            model: Cama,
            as: 'Cama',
            attributes: ['numero', 'estado'],
            include: [
              {
                model: Habitacion,
                as: 'Habitacion',
                attributes: ['numero'],
                include: [
                  {
                    model: Ala,
                    as: 'Ala',
                    attributes: ['nombre']
                  }
                ]
              }
            ]
          },
          {
            model: MotivoInternacion,
            as: 'MotivoInternacion',
            attributes: ['descripcion']
          }
        ],
        order: [['fecha_ingreso', 'DESC']]
      });

      res.render('internacionListado', { internaciones });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el listado de internaciones');
    }
  },

  async renderFormularioConError(res, datosPrevios, error) {
    const pacientes = await Paciente.findAll({ where: { estado: 'Activo' } });
    const alas = await Ala.findAll();
    const habitaciones = await Habitacion.findAll();
    const camas = await Cama.findAll();
    const motivos = await MotivoInternacion.findAll();

    res.render('internacion', {
      pacientes,
      alas,
      habitaciones,
      camas,
      motivos,
      datosPrevios,
      error
    });
  }
};
