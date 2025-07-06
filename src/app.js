const express = require("express");
const cors = require("cors");

const booksRoutes = require("./routes/books");
const ordersRouter = require("./routes/orders");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = [
  "https://bookbay-frontend-eight.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS não permitido para este domínio"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
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
