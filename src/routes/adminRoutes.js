const express = require("express");
const router = express.Router();
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.use(authorizeAdmin);

router.get("/", (req, res) => {
  res.json({ message: "Bem-vindo à área admin!" });
});

module.exports = router;
