const { sequelize } = require('../models');

sequelize.sync({ force: false, alter: true }) 
  .then(() => {
    console.log('Tablas sincronizadas correctamente.');
    process.exit();
  })
  .catch((err) => {
    console.error('Error al sincronizar las tablas:', err);
    process.exit(1);
  });