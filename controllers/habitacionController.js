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

//  Obtener camas de una habitación (para el Modal AJAX)
const obtenerCamasPorHabitacion = async (req, res, next) => {
  try {
    const { idHabitacion } = req.params;
    
    const camas = await Cama.findAll({
      where: { id_habitacion: idHabitacion },
      order: [['numero', 'ASC']] 
    });

    return res.json(camas);
  } catch (error) {
    console.error("Error al obtener camas por habitación:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getMapaHabitaciones,
  higienizarCama,
  obtenerCamasPorHabitacion 
};