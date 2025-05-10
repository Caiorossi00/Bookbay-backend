const fs = require('fs/promises');
const path = require('path');

const booksFilePath = path.join(__dirname, '../data/books.json');

const readBooks = async () => {
  try {
    const data = await fs.readFile(booksFilePath, 'utf-8');
    return JSON.parse(data);  
  } catch (error) {
    console.error('Erro ao ler os livros:', error);
    throw new Error('Não foi possível ler os livros.');
  }
};

const writeBooks = async (books) => {
  try {
    const data = JSON.stringify(books, null, 2); 
    await fs.writeFile(booksFilePath, data, 'utf-8');
  } catch (error) {
    console.error('Erro ao escrever os livros:', error);
    throw new Error('Não foi possível salvar os livros.');
  }
};

module.exports = { readBooks, writeBooks };