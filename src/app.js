const express = require("express");
const cors = require("cors");

const booksRoutes = require("./routes/books");
const ordersRouter = require("./routes/orders");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/books", booksRoutes);
app.use("/orders", ordersRouter);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API do BookBay funcionando.");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
