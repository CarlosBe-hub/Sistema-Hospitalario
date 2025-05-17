const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
// Importar Sequelize y modelos
const { sequelize } = require('./models'); 
// Importar rutas
const pacientesRoutes = require('./routes/pacientes');
const admisionRoutes = require('./routes/admision');

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
require('./middlewares/core')(app);
app.use(methodOverride('_method'));

// Rutas
app.use(pacientesRoutes); 
app.use(admisionRoutes);
app.get('/', (req, res) => {
  res.render('iniciohospital');
});
// Middleware de prueba
app.use(require('./middlewares/notFound'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
