const { getCollection } = require("../db");
const { ObjectId } = require("mongodb");
const { sendOrderNotification } = require("../services/emailService");

async function getAllOrders(req, res) {
  const ordersCollection = await getCollection("orders");
  const booksCollection = await getCollection("books");

  try {
    const orders = await ordersCollection.find().toArray();

    for (const order of orders) {
      const livrosCompletos = [];

      for (const livroId of order.produtos) {
        const id =
          typeof livroId === "string" ? new ObjectId(livroId) : livroId;
        const livro = await booksCollection.findOne({ _id: id });

        if (livro) {
          livrosCompletos.push({
            _id: livro._id,
            title: livro.title,
            price: livro.price,
            cover: livro.cover,
          });
        }
      }

      order.produtos = livrosCompletos;
    }

    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
}

async function createOrder(req, res) {
  const {
    usuarioId,
    nome,
    contato,
    cep,
    rua,
    bairro,
    numero,
    pagamento,
    produtos,
  } = req.body;

  if (
    !usuarioId ||
    !nome ||
    !contato ||
    !cep ||
    !rua ||
    !bairro ||
    !numero ||
    !pagamento ||
    !produtos ||
    !Array.isArray(produtos) ||
    produtos.length === 0
  ) {
    return res.status(400).json({ error: "Dados do pedido incompletos" });
  }

  const ordersCollection = await getCollection("orders");
  const booksCollection = await getCollection("books");

  try {
    const livrosCompletos = [];
    let subtotal = 0;

    for (const livroId of produtos) {
      const id = typeof livroId === "string" ? new ObjectId(livroId) : livroId;
      const livro = await booksCollection.findOne({ _id: id });

      if (livro) {
        livrosCompletos.push({
          _id: livro._id,
          title: livro.title,
          price: livro.price,
          cover: livro.cover,
        });

        subtotal += Number(livro.price);
      }
    }

    const shippingFee = subtotal < 149 ? 30 : 0;
    const total = subtotal + shippingFee;

    const newOrder = {
      usuarioId,
      nome,
      contato,
      cep,
      rua,
      bairro,
      numero,
      pagamento,
      produtos,
      subtotal,
      shippingFee,
      total,
    };

    const result = await ordersCollection.insertOne(newOrder);

    const pedidoParaEmail = {
      ...newOrder,
      produtos: livrosCompletos,
    };

    sendOrderNotification(pedidoParaEmail).catch((err) =>
      console.error("Erro ao enviar email de notificação:", err)
    );

    res.status(201).json({ ...newOrder, _id: result.insertedId });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
}

async function deleteOrder(req, res) {
  const orderId = req.params.id;

  if (!ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: "ID de pedido inválido" });
  }

  const ordersCollection = await getCollection("orders");

  try {
    const result = await ordersCollection.deleteOne({
      _id: new ObjectId(orderId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir pedido" });
  }
}

async function getOrdersByUser(req, res) {
  const userId = req.user.id;

  if (!userId) return res.status(400).json({ error: "User ID necessário" });

  const ordersCollection = await getCollection("orders");
  const booksCollection = await getCollection("books");

  try {
    const orders = await ordersCollection.find({ usuarioId: userId }).toArray();

    for (const order of orders) {
      const livrosCompletos = [];

      for (const livroId of order.produtos) {
        const id =
          typeof livroId === "string" ? new ObjectId(livroId) : livroId;
        const livro = await booksCollection.findOne({ _id: id });

        if (livro) {
          livrosCompletos.push({
            _id: livro._id,
            title: livro.title,
            price: livro.price,
            cover: livro.cover,
            author: livro.author,
          });
        }
      }

      order.produtos = livrosCompletos;
    }

    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos do usuário" });
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  deleteOrder,
  getOrdersByUser,
};
