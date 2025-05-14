const cors = require("cors");
const express = require("express");
const { readBooks, writeBooks } = require("./utils/fileHandler");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/books", async (req, res) => {
  try {
    const books = await readBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Erro ao ler os livros" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const newBook = req.body;
    const books = await readBooks();

    books.push(newBook);
    await writeBooks(books);

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar o livro" });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const books = await readBooks();
    const bookId = parseInt(req.params.id, 10);

    if (isNaN(bookId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    const updatedBook = req.body;
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };

    await writeBooks(books);
    res.status(200).json(books[bookIndex]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o livro" });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const books = await readBooks();
    const bookId = parseInt(req.params.id, 10);

    if (isNaN(bookId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    const removedBook = books.splice(bookIndex, 1)[0];

    await writeBooks(books);
    res.status(200).json(removedBook);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar o livro" });
  }
});

app.get("/books/destaques", async (req, res) => {
  try {
    const books = await readBooks();
    const destaques = books.filter((book) => book.isDestaque);
    res.json(destaques);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os livros em destaque" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
