const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../controllers/authController");

router.use(authenticateToken);

router.get("/", (req, res) => {
  res.json({ message: "Bem-vindo à área admin!" });
});

module.exports = router;
