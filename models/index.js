const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Importar modelos
const Admision = require('./AdmisionModel');
const Cama = require('./CamaModel');
const Enfermero = require('./EnfermeroModel');
const Habitacion = require('./HabitacionModel');
const Internacion = require('./InternacionModel');
const Medico = require('./MedicoModel');
const Paciente = require('./PacienteModel');
const AltaMedica = require('./AltaMedicaModel');
const CuidadosEnfermeria = require('./CuidadosEnfermeriaModel');
const HistorialMedico = require('./HistorialMedicoModel');

// Relaciones

// Paciente
Paciente.hasMany(Internacion, { foreignKey: 'id_paciente' });
Internacion.belongsTo(Paciente, { foreignKey: 'id_paciente' });

Paciente.hasMany(Admision, { foreignKey: 'id_paciente' });
Admision.belongsTo(Paciente, { foreignKey: 'id_paciente' });

Paciente.hasMany(CuidadosEnfermeria, { foreignKey: 'id_paciente' });
CuidadosEnfermeria.belongsTo(Paciente, { foreignKey: 'id_paciente' });

Paciente.hasMany(HistorialMedico, { foreignKey: 'id_paciente' });
HistorialMedico.belongsTo(Paciente, { foreignKey: 'id_paciente' });

// Medico
Medico.hasMany(HistorialMedico, { foreignKey: 'id_medico' });
HistorialMedico.belongsTo(Medico, { foreignKey: 'id_medico' });

// Enfermero
Enfermero.hasMany(CuidadosEnfermeria, { foreignKey: 'id_enfermero' });
CuidadosEnfermeria.belongsTo(Enfermero, { foreignKey: 'id_enfermero' });

// Habitacion
Habitacion.hasMany(Cama, { foreignKey: 'id_habitacion' });
Cama.belongsTo(Habitacion, { foreignKey: 'id_habitacion' });

Habitacion.hasMany(Internacion, { foreignKey: 'id_habitacion' });
Internacion.belongsTo(Habitacion, { foreignKey: 'id_habitacion' });

// Internacion
Internacion.hasOne(Admision, { foreignKey: 'id_internacion' });
Admision.belongsTo(Internacion, { foreignKey: 'id_internacion' });

Internacion.hasOne(AltaMedica, { foreignKey: 'id_internacion' });
AltaMedica.belongsTo(Internacion, { foreignKey: 'id_internacion' });

// Exportar modelos y sequelize
module.exports = {
  sequelize,
  Sequelize,
  Admision,
  Cama,
  Enfermero,
  Habitacion,
  Internacion,
  Medico,
  Paciente,
  AltaMedica,
  CuidadosEnfermeria,
  HistorialMedico
};