const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const { authenticateToken } = require("../controllers/authController");

router.get("/", ordersController.getAllOrders);
router.post("/", authenticateToken, ordersController.createOrder);
router.delete("/:id", ordersController.deleteOrder);

module.exports = router;
