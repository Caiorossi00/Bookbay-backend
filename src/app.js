const cors = require("cors");
const express = require("express");
const { ObjectId } = require("mongodb");
const connectToDatabase = require("./db");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let booksCollection;

connectToDatabase()
  .then((db) => {
    booksCollection = db.collection("books");
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });

app.get("/books", async (req, res) => {
  try {
    const books = await booksCollection.find().toArray();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os livros" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const newBook = req.body;
    const result = await booksCollection.insertOne(newBook);
    res.status(201).json({ ...newBook, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar o livro" });
  }
});

app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const updatedBook = req.body;
  try {
    const result = await booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBook }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res.status(200).json({ message: "Livro atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o livro" });
  }
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await booksCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res.status(200).json({ message: "Livro deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: "Erro ao deletar o livro" });
  }
});

app.get("/books/destaques", async (req, res) => {
  try {
    const destaques = await booksCollection
      .find({ isDestaque: true })
      .toArray();
    res.json(destaques);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os destaques" });
  }
});

app.get("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await booksCollection.findOne({
      id: Number(id),
    });

    if (!book) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o livro" });
  }
});
