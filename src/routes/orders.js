const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.get("/", ordersController.getAllOrders);
router.post("/", ordersController.createOrder);
router.delete("/:id", ordersController.deleteOrder);
router.get("/pedidos", ordersController.getOrdersByUser);

module.exports = router;
