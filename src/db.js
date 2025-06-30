require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  ssl: true,
  retryWrites: true,
  tlsAllowInvalidCertificates: false,
});

let db;

async function connectToDatabase() {
  if (db) return db;
  await client.connect();
  db = client.db("bookbay");
  console.log("Conectado ao MongoDB Atlas");
  return db;
}

async function getCollection(name) {
  if (!db) {
    await connectToDatabase();
  }
  return db.collection(name);
}

module.exports = {
  connectToDatabase,
  getCollection,
};
