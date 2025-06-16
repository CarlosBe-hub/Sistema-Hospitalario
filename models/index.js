const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Importar modelos
const Admision = require('./AdmisionModel');
const Ala = require('./AlaModel');
const AltaMedica = require('./AltaMedicaModel');
const Cama = require('./CamaModel');
const ContactoEmergencia = require('./ContactoEmergenciaModel');
const CuidadosEnfermeria = require('./CuidadosEnfermeriaModel');
const Diagnostico = require('./DiagnosticoModel');
const Enfermero = require('./EnfermeroModel');
const Especializacion = require('./EspecializacionModel');
const Guardia = require('./GuardiaModel');
const Habitacion = require('./HabitacionModel');
const HistorialMedico = require('./HistorialMedicoModel');
const Internacion = require('./InternacionModel');
const Medico = require('./MedicoModel');
const MotivoInternacion = require('./MotivoInternacionModel');
const MotivoAdmision = require('./MotivoAdmisionModel');
const ObraSocial = require('./ObraSocialModel');
const Paciente = require('./PacienteModel');
const SignosVitales = require('./SignosVitalesModel');

// ─────────────────────────────────────────────
// PACIENTE RELACIONES
Paciente.hasMany(Internacion, { foreignKey: 'id_paciente' });
Internacion.belongsTo(Paciente, { foreignKey: 'id_paciente', as: 'Paciente' });

Paciente.hasMany(ContactoEmergencia, { foreignKey: 'id_paciente' });
ContactoEmergencia.belongsTo(Paciente, { foreignKey: 'id_paciente' });

Paciente.hasMany(Diagnostico, { foreignKey: 'id_paciente' });
Diagnostico.belongsTo(Paciente, { foreignKey: 'id_paciente' });

Paciente.hasMany(HistorialMedico, { foreignKey: 'id_paciente' });
HistorialMedico.belongsTo(Paciente, { foreignKey: 'id_paciente' });

Paciente.hasMany(CuidadosEnfermeria, { foreignKey: 'id_paciente' });
CuidadosEnfermeria.belongsTo(Paciente, { foreignKey: 'id_paciente' });

Paciente.hasMany(Admision, { foreignKey: 'id_paciente' });
Admision.belongsTo(Paciente, { foreignKey: 'id_paciente', as: 'paciente' });

Paciente.belongsTo(ObraSocial, {
  foreignKey: 'id_obra_social',
  as: 'obraSocial'
});
ObraSocial.hasMany(Paciente, {
  foreignKey: 'id_obra_social',
  as: 'pacientes'
});

// ─────────────────────────────────────────────
// INTERNACION RELACIONES
Internacion.belongsTo(Habitacion, { foreignKey: 'id_habitacion', as: 'Habitacion' });
Habitacion.hasMany(Internacion, { foreignKey: 'id_habitacion' });

Internacion.belongsTo(MotivoInternacion, { foreignKey: 'id_motivo', as: 'MotivoInternacion' });
MotivoInternacion.hasMany(Internacion, { foreignKey: 'id_motivo' });

Internacion.hasOne(AltaMedica, { foreignKey: 'id_internacion' });
AltaMedica.belongsTo(Internacion, { foreignKey: 'id_internacion' });

Internacion.hasMany(Admision, { foreignKey: 'id_internacion' });
Admision.belongsTo(Internacion, { foreignKey: 'id_internacion' });

Internacion.hasMany(CuidadosEnfermeria, { foreignKey: 'id_internacion' });
CuidadosEnfermeria.belongsTo(Internacion, { foreignKey: 'id_internacion' });

Internacion.hasMany(SignosVitales, { foreignKey: 'id_internacion' });
SignosVitales.belongsTo(Internacion, { foreignKey: 'id_internacion' });

Internacion.belongsTo(Cama, { foreignKey: 'id_cama', as: 'Cama' });
Cama.hasOne(Internacion, { foreignKey: 'id_cama', as: 'Internacion' });

// ─────────────────────────────────────────────
// HABITACION Y ALA
Habitacion.belongsTo(Ala, { foreignKey: 'id_ala', as: 'Ala' });
Ala.hasMany(Habitacion, { foreignKey: 'id_ala' });

Habitacion.hasMany(Cama, { foreignKey: 'id_habitacion' });
Cama.belongsTo(Habitacion, { foreignKey: 'id_habitacion', as: 'Habitacion' });

Habitacion.hasMany(Admision, { foreignKey: 'id_habitacion' });
Admision.belongsTo(Habitacion, { foreignKey: 'id_habitacion' });

// ─────────────────────────────────────────────
// ADMISION - MOTIVOADMISION
Admision.belongsTo(MotivoAdmision, {
  foreignKey: 'id_motivo',
  as: 'motivo_admision'
});
MotivoAdmision.hasMany(Admision, {
  foreignKey: 'id_motivo'
});
// MEDICO Y ESPECIALIZACION
Diagnostico.belongsTo(Medico, { foreignKey: 'id_medico' });
Medico.hasMany(Diagnostico, { foreignKey: 'id_medico' });

HistorialMedico.belongsTo(Medico, { foreignKey: 'id_medico' });
Medico.hasMany(HistorialMedico, { foreignKey: 'id_medico' });

Medico.belongsTo(Especializacion, { foreignKey: 'id_especializacion' });
Especializacion.hasMany(Medico, { foreignKey: 'id_especializacion' });

// ─────────────────────────────────────────────
// ENFERMERO
SignosVitales.belongsTo(Enfermero, { foreignKey: 'id_enfermero' });
Enfermero.hasMany(SignosVitales, { foreignKey: 'id_enfermero' });

CuidadosEnfermeria.belongsTo(Enfermero, { foreignKey: 'id_enfermero' });
Enfermero.hasMany(CuidadosEnfermeria, { foreignKey: 'id_enfermero' });

// ─────────────────────────────────────────────
// EXPORTAR
module.exports = {
  sequelize,
  Sequelize,
  Admision,
  Ala,
  AltaMedica,
  Cama,
  ContactoEmergencia,
  CuidadosEnfermeria,
  Diagnostico,
  Enfermero,
  Especializacion,
  Guardia,
  Habitacion,
  HistorialMedico,
  Internacion,
  Medico,
  MotivoInternacion,
  MotivoAdmision,
  ObraSocial,
  Paciente,
  SignosVitales
};
