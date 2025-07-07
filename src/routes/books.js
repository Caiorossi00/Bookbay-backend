const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const { authenticateToken } = require("../controllers/authController");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.get("/", booksController.getAllBooks);
router.get("/:id", booksController.getBookById);
router.get("/genero/:genre", booksController.getBooksByGenre);

router.post("/", authenticateToken, authorizeAdmin, booksController.createBook);
router.patch(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  booksController.patchBook
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  booksController.deleteBook
);

module.exports = router;
