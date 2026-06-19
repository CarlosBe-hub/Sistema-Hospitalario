const { Cama, Habitacion, Ala } = require('../models');

// Mostrar el Mapa Visual de Habitaciones y Camas
const getMapaHabitaciones = async (req, res, next) => {
  try {
    const habitaciones = await Habitacion.findAll({
      include: [
        { model: Ala, as: 'Ala' },
        { model: Cama, as: 'Camas' } 
      ],
      order: [
        [{ model: Ala, as: 'Ala' }, 'nombre', 'ASC'],
        ['numero', 'ASC'],
        [{ model: Cama, as: 'Camas' }, 'numero', 'ASC']
      ]
    });

    res.render('habitaciones/mapaHabitaciones', { 
      habitaciones,
      success: req.query.success === '1' 
    });
  } catch (error) {
    console.error('Error al cargar el mapa de habitaciones:', error);
    next(error);
  }
};

// Cambiar el estado de la cama a "Libre" (Higienizar)
const higienizarCama = async (req, res, next) => {
  try {
    const { id_cama } = req.params;
    const cama = await Cama.findByPk(id_cama);

    if (!cama) {
      return res.status(404).send('Cama no encontrada.');
    }

    // Pasamos la cama a estado Libre
    await cama.update({ estado: 'Libre' });

    res.redirect('/habitaciones/mapa?success=1');
  } catch (error) {
    console.error('Error al higienizar la cama:', error);
    next(error);
  }
};

module.exports = {
  getMapaHabitaciones,
  higienizarCama
};