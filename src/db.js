require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB Atlas");
    return client.db("bookbay");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB Atlas:", err);
    process.exit(1);
  }
}

module.exports = connectToDatabase;
