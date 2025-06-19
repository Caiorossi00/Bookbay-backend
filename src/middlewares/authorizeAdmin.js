const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

function authorizeAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Acesso negado: Admins apenas" });
    }
    req.user = user;
    next();
  });
}

module.exports = authorizeAdmin;
