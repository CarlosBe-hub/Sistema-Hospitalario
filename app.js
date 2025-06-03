const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');

// Importar Sequelize y modelos
const { sequelize } = require('./models');

// Importar rutas
const pacientesRoutes = require('./routes/pacientes');
const admisionRoutes = require('./routes/admision');
const internacionRoutes = require('./routes/internacion');

// Configuración del motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear datos de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Middleware core (si incluye variables globales u otros)
require('./middlewares/core')(app);

// Montar rutas con prefijo
app.use('/pacientes', pacientesRoutes);
app.use('/admision', admisionRoutes);
app.use('/internacion', internacionRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.render('iniciohospital');
});

// Middleware para manejar rutas no encontradas (404)
app.use(require('./middlewares/notFound'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});