const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario, Rol } = require('../models'); 

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro_hospital_ulp_2026";

module.exports = {
  // Mostrar la vista del formulario de Login
  mostrarLogin(req, res) {
    res.render('login', { error: null });
  },

  async procesarLogin(req, res) {
    try {
      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ 
        where: { email }, 
        include: [{ model: Rol, as: 'rol' }] 
      });

      if (!usuario) {
        return res.render('login', { error: 'El correo electrónico o la contraseña son incorrectos.' });
      }

      const passwordCorrecto = await bcrypt.compare(password, usuario.password);

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

      return res.redirect('/inicio?bienvenido=1');

    } catch (error) {
      console.error('Error crítico en el proceso de Login:', error);
      return res.render('login', { error: 'Ocurrió un error interno en el servidor. Intente de nuevo.' });
    }
  },

  logout(req, res) {
    res.clearCookie('jwt');
    return res.redirect('/login');
  }
};