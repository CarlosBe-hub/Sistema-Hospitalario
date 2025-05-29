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
      const camas = await Cama.findAll({
        where: {
          estado: { [Op.in]: ['Libre', 'Higienizada'] }
        }
      });

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

      const motivos = await MotivoInternacion.findAll();

      res.render('internacion', {
        pacientes,
        alas,
        habitaciones,
        camas,
        diagnosticos,
        motivos
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el formulario de internación');
    }
  },

  async crearInternacion(req, res) {
    try {
      const {
        id_paciente,
        fecha_ingreso,
        diagnostico,
        id_habitacion,
        id_motivo
      } = req.body;

      await Internacion.create({
        fecha_ingreso,
        diagnostico,
        estado: 'Activa',
        id_paciente,
        id_habitacion,
        id_motivo: id_motivo || null
      });

      await Cama.update(
        { estado: 'Ocupada' },
        {
          where: {
            id_habitacion,
            estado: { [Op.in]: ['Libre', 'Higienizada'] }
          },
          limit: 1
        }
      );

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
          { model: Paciente, attributes: ['nombre', 'apellido', 'dni'] },
          { model: Habitacion, attributes: ['numero'] }
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
