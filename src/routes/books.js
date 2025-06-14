const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

router.get("/", booksController.getAllBooks);
router.get("/:id", booksController.getBookById);
router.post("/", booksController.createBook);
router.patch("/:id", booksController.patchBook);
router.delete("/:id", booksController.deleteBook);
router.get("/genero/:genre", booksController.getBooksByGenre);

module.exports = router;
