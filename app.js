const express = require('express');
const path = require('path');
const app = express();

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

// Rutas
app.use(pacientesRoutes); 
app.use(admisionRoutes);
app.get('/', (req, res) => {
  res.render('iniciohospital');
});
// Middleware de prueba
app.use(require('./middlewares/notFound'));


// Sincronizar modelos Sequelize
sequelize.sync({ alter: true }) // usar { force: true } para forzar el borrado y creación
  .then(() => {
    console.log('Tablas sincronizadas correctamente');
    app.listen(3000, () => {
      console.log("Servidor iniciado en http://localhost:3000");
    });
  })
  .catch(err => {
    console.error('Error al sincronizar modelos con la base de datos:', err);
  });