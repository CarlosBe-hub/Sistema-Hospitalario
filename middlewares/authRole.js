const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro_hospital_ulp_2026";

function checkRole(requiredRoles) {
  return (req, res, next) => {
    try {
      //  Extraer el token de la cookie 'jwt' o del Header de autorizacion
      const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

      // Si no hay token, lo redirigimos directo a la pantalla de login
      if (!token) {
        return res.status(401).redirect("/login");
      }

      // Verificar si el token es válido y no expiró
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Convertimos los roles requeridos a un Array por si pasás uno solo: checkRole('admin')
      const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      // Control de accesos por rol 
      if (!rolesArray.includes(decoded.rol)) {
        return res.status(403).send(
          "<h3>Acceso Denegado</h3><p>Tu rol de usuario no tiene permisos para acceder a este módulo médico.</p><a href='/inicio'>Volver al Inicio</a>"
        );
      }

      //  Si el token es real y el rol coincide, guardamos los datos del usuario en el 'req'
      req.user = decoded;
      
      next();

    } catch (error) {
      console.error("Error en middleware de autenticación:", error.message);
      res.clearCookie('jwt');
      return res.redirect("/login");
    }
  };
}

module.exports = checkRole;