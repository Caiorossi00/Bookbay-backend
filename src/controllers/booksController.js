const { getCollection } = require("../db");
const { ObjectId } = require("mongodb");

async function getAllBooks(req, res) {
  const booksCollection = await getCollection("books");

  try {
    const books = await booksCollection.find().toArray();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar livros" });
  }
}

async function getBookById(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const booksCollection = await getCollection("books");

  try {
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });
    if (!book) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar livro" });
  }
}

async function createBook(req, res) {
  const newBook = req.body;
  const booksCollection = await getCollection("books");

  try {
    const result = await booksCollection.insertOne(newBook);
    res.status(201).json({ ...newBook, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar livro" });
  }
}

async function patchBook(req, res) {
  const { id } = req.params;
  const updatedFields = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const booksCollection = await getCollection("books");

  try {
    const result = await booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res
      .status(200)
      .json({ message: "Livro atualizado parcialmente com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar livro" });
  }
}

async function deleteBook(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const booksCollection = await getCollection("books");

  try {
    const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res.status(200).json({ message: "Livro removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir livro" });
  }
}

async function getBooksByGenre(req, res) {
  const { genre } = req.params;
  const booksCollection = await getCollection("books");

  try {
    const books = await booksCollection.find({ genres: genre }).toArray();

    if (books.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum livro encontrado para esse gênero" });
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar livros pelo gênero" });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  patchBook,
  deleteBook,
  getBooksByGenre,
};
