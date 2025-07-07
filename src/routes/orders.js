const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const { authenticateToken } = require("../controllers/authController");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.get(
  "/",
  authenticateToken,
  authorizeAdmin,
  ordersController.getAllOrders
);
router.post("/", authenticateToken, ordersController.createOrder);
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  ordersController.deleteOrder
);
router.get("/pedidos", authenticateToken, ordersController.getOrdersByUser);

module.exports = router;
