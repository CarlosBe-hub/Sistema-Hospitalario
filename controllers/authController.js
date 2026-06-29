const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario, Rol } = require('../models'); 

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro_hospital_ulp_2026";

module.exports = {
  // Mostrar la vista del formulario de Login
  mostrarLogin(req, res) {
    // Mandamos mensajeError como null para que la primera vez no muestre alertas rojas
    res.render('login', { error: null });
  },

  async procesarLogin(req, res) {
    try {
      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ where: { email }, include: [{ model: Rol, as: 'rol' }] });
      
      console.log("1. ¿Encontró al usuario en MySQL?:", usuario ? "SÍ" : "NO");

      if (!usuario) {
        return res.render('login', { error: 'El correo electrónico o la contraseña son incorrectos.' });
      }

      const passwordCorrecto = await bcrypt.compare(password, usuario.password);
      console.log("2. ¿La contraseña dio true con bcrypt?:", passwordCorrecto);

      if (!passwordCorrecto) {
        return res.render('login', { error: 'El correo electrónico o la contraseña son incorrectos.' });
      }

      const token = jwt.sign(
        { 
          id_usuario: usuario.id_usuario, 
          nombre: usuario.nombre, 
          rol: usuario.rol.nombre.toLowerCase()
        },
        JWT_SECRET,
        { expiresIn: '8h' } 
      );

      res.cookie('jwt', token, {
        httpOnly: true, 
        secure: false,  
        maxAge: 8 * 60 * 60 * 1000 
      });

      return res.redirect('/inicio');

    } catch (error) {
      console.error('Error crítico en el proceso de Login:', error);
      return res.render('login', { error: 'Ocurrió un error interno en el servidor. Intente de nuevo.' });
    }
  },

  logout(req, res) {
    res.clearCookie('jwt'); // Borra la cookie del cliente
    return res.redirect('/login'); // Lo manda a la entrada del sistema
  }
};