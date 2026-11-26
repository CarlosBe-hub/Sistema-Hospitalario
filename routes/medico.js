const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const checkRole = require('../middlewares/authRole');

// ==========================================
// RUTAS EXCLUSIVAS DE ADMINISTRADOR
// ==========================================
router.get('/GestionMedico', checkRole('admin'), medicoController.getGestionMedico);
router.post('/crear', checkRole('admin'), medicoController.crearMedico);
router.post('/editar', checkRole('admin'), medicoController.editarMedico);
router.patch('/cambiar-estado', checkRole('admin'), medicoController.cambiarEstadoMedico);

// ==========================================
// RUTAS CLÍNICAS (MÉDICOS Y ADMIN)
// ==========================================
// Mostrar panel principal con la lista de pacientes internados activos
router.get('/', medicoController.vistaPacientesInternados);

// Ver el listado global de todas las internaciones finalizadas
router.get('/historial', medicoController.vistaHistorial);

// Ver el detalle completo e histórico de una internación pasada
router.get('/historial/:id_internacion', medicoController.detalleHistorial);

// Guardar Evaluación Médica y Diagnóstico
router.post('/diagnostico', medicoController.guardarDiagnostico);

// Guardar un nuevo Tratamiento o Indicación Médica
router.post('/tratamiento', medicoController.guardarTratamiento);

// Dar el Alta Hospitalaria al paciente
router.post('/alta', medicoController.darAlta);

// Ver el detalle de la historia clínica de una internación específica activa
router.get('/:id_internacion', medicoController.detallePaciente);

module.exports = router;