const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro_hospital_ulp_2026";

module.exports = (req, res, next) => {
  // agarramos el token de la cookie 'jwt'
  const token = req.cookies?.jwt;

  if (token) {
    try {
      // Si hay token, lo desencriptamos
      const decoded = jwt.verify(token, JWT_SECRET);
      
      res.locals.user = decoded; 
    } catch (error) {
      console.error("Error al decodificar cookie en locals:", error.message);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

  next();
};