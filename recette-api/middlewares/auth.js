const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Vérifie si l'en-tête "Authorization" est présent et s'il commence par "Bearer "
  const token = req.header("Authorization") && req.header("Authorization").startsWith("Bearer ")
    ? req.header("Authorization").split(" ")[1]  // Prend le token après "Bearer "
    : null;
    console.log("Token reçu : ", token);

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, "secret123"); // à sécuriser en .env
    req.user = decoded;
    next(); // Passe à la prochaine étape (middleware ou route)
  } catch (err) {
    res.status(400).json({ message: "Token invalide." });
  }
};