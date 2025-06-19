const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getCollection } = require("../db");

const SECRET = process.env.JWT_SECRET;

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
}

async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    const usersCollection = await getCollection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email já registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 8);

    await usersCollection.insertOne({
      username,
      email,
      passwordHash,
      role: "user",
    });

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro no registro" });
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

module.exports = { login, register, authenticateToken };
