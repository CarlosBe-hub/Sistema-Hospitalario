const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser'); 

// Importar Sequelize y modelos
const { sequelize } = require('./models');

// Importar controlador de Auth y el Middleware por roles
const authController = require('./controllers/authController');
const checkRole = require('./middlewares/authRole');

// Importar rutas existentes
const pacientesRoutes = require('./routes/pacientes');
const admisionRoutes = require('./routes/admision');
const internacionRoutes = require('./routes/internacion');
const emergenciaRoutes = require('./routes/emergencia'); 
const medicoRoutes = require('./routes/medico');         
const enfermeriaRoutes = require('./routes/enfermeria');

// Configuración del motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear datos de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
app.use(methodOverride('_method'));

// Middleware core 
require('./middlewares/core')(app);


// Rutas públicas de Login 
app.get('/login', authController.mostrarLogin);
app.post('/login', authController.procesarLogin);
app.get('/logout', authController.logout);


// Proteger todas las rutas anteponiendo el middleware checkRole
app.use('/pacientes', checkRole(['admin', 'medico', 'enfermero', 'recepcion']), pacientesRoutes);
app.use('/admision', checkRole(['admin', 'recepcion']), admisionRoutes);
app.use('/internacion', checkRole(['admin', 'medico', 'enfermero', 'recepcion']), internacionRoutes);
app.use('/emergencia', checkRole(['admin', 'recepcion']), emergenciaRoutes); 
app.use('/medico', checkRole(['admin', 'medico']), medicoRoutes);         
app.use('/enfermeria', checkRole(['admin', 'enfermero']), enfermeriaRoutes); 
app.use('/habitaciones', checkRole(['admin', 'medico', 'enfermero', 'recepcion']), require('./routes/habitaciones'));


// Proteger la ruta principal (Raíz) y agregar la redirección '/inicio'
app.get('/', checkRole(['admin', 'medico', 'enfermero', 'recepcion']), (req, res) => {
  res.render('iniciohospital');
});

app.get('/inicio', checkRole(['admin', 'medico', 'enfermero', 'recepcion']), (req, res) => {
  res.render('iniciohospital');
});


// Middleware para manejar rutas no encontradas (404)
app.use(require('./middlewares/notFound'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});