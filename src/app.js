const express = require("express");
const cors = require("cors");

const booksRoutes = require("./routes/books");
const ordersRouter = require("./routes/orders");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = ["https://bookbay-frontend-eight.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error("CORS não permitido para este domínio"),
          false
        );
      }
      return callback(null, true);
    },
  })
);
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
