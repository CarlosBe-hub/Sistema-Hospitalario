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

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Parsear datos de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./middlewares/core')(app);
app.use(methodOverride('_method'));

// Montar rutas con base
app.use(pacientesRoutes);
app.use(admisionRoutes);
app.use('/internacion', internacionRoutes);

app.get('/', (req, res) => {
  res.render('iniciohospital');
});

app.use(require('./middlewares/notFound'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
