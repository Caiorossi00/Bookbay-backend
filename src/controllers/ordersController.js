const { getCollection } = require("../db");
const { ObjectId } = require("mongodb");

async function getAllOrders(req, res) {
  const ordersCollection = await getCollection("orders");
  try {
    const orders = await ordersCollection.find().toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
}

async function createOrder(req, res) {
  const newOrder = req.body;

  if (
    !newOrder.usuarioId ||
    !newOrder.cep ||
    !newOrder.rua ||
    !newOrder.bairro ||
    !newOrder.numero ||
    !newOrder.pagamento ||
    !newOrder.produtos ||
    !Array.isArray(newOrder.produtos) ||
    newOrder.produtos.length === 0 ||
    !newOrder.total
  ) {
    return res.status(400).json({ error: "Dados do pedido incompletos" });
  }

  const ordersCollection = await getCollection("orders");

  try {
    const result = await ordersCollection.insertOne(newOrder);
    res.status(201).json({ ...newOrder, _id: result.insertedId });
  } catch (error) {
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
  const userId = req.query.userId;

  if (!userId) return res.status(400).json({ error: "User ID necessário" });

  const ordersCollection = await getCollection("orders");

  try {
    const orders = await ordersCollection.find({ usuarioId: userId }).toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos do usuário" });
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  deleteOrder,
  getOrdersByUser,
};
