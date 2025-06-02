const Internacion = require('../models/InternacionModel');
const Paciente = require('../models/PacienteModel');
const Habitacion = require('../models/HabitacionModel');
const Cama = require('../models/CamaModel');
const Ala = require('../models/AlaModel');
const MotivoInternacion = require('../models/MotivoInternacionModel');
const { Op } = require('sequelize');

module.exports = {
  async formNuevaInternacion(req, res) {
    try {
      const pacientes = await Paciente.findAll({ where: { estado: 'Activo' } });
      const alas = await Ala.findAll();
      const habitaciones = await Habitacion.findAll();
      const camas = await Cama.findAll();
      const motivos = await MotivoInternacion.findAll();

      const diagnosticos = [
        'Neumonía',
        'Fractura',
        'Apendicitis',
        'COVID-19',
        'Infarto',
        'Gripe',
        'Dolor abdominal',
        'Cirugía programada'
      ];

      res.render('internacion', {
        pacientes,
        alas,
        habitaciones,
        camas,
        motivos,
        diagnosticos
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el formulario de internación');
    }
  },

  async crearInternacion(req, res) {
    try {
      const { id_paciente, fecha_ingreso, diagnostico, id_habitacion, id_motivo, id_cama } = req.body;

      const paciente = await Paciente.findByPk(id_paciente);

      // Verificar conflicto de género
      const internados = await Internacion.findAll({
        where: {
          id_habitacion,
          estado: 'Activa'
        },
        include: [{ model: Paciente, attributes: ['genero'] }]
      });

      const conflictoGenero = internados.some(i => i.Paciente.genero !== paciente.genero);
      if (conflictoGenero) {
        return res.status(400).send('No se puede internar un paciente de género diferente en esta habitación.');
      }

      // Verificar que la cama seleccionada esté disponible
      const cama = await Cama.findByPk(id_cama);

      if (!cama || cama.id_habitacion != id_habitacion) {
        return res.status(400).send('La cama seleccionada no pertenece a la habitación elegida.');
      }

      if (!['Libre', 'Higienizada'].includes(cama.estado)) {
        return res.status(400).send('La cama seleccionada no está disponible.');
      }

      // Crear la internación
      await Internacion.create({
        fecha_ingreso,
        diagnostico,
        estado: 'Activa',
        id_paciente,
        id_habitacion,
        id_motivo: id_motivo || null
      });

      // Cambiar el estado de la cama a "Ocupada"
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
            model: Habitacion,
            attributes: ['numero'],
            include: [
              {
                model: Ala,
                as: 'ala',
                attributes: ['nombre']
              },
              {
                model: Cama,
                attributes: ['numero', 'estado']
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
  }
};
