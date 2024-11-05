const express = require("express");
const orderRouter = express.Router(); // Correctly use express.Router()
const controller = require("../controllers/orderController"); 

orderRouter.get("/", controller.getOrders);
orderRouter.post("/", controller.addOrder);
orderRouter.get("/:order_id", controller.getOrderById);
orderRouter.put("/:order_id/items", controller.updateOrderAndItems);
orderRouter.delete("/:order_id", controller.deleteOrder);
orderRouter.post("/:order_id/items", controller.addOrderItem);
orderRouter.get("/:order_id/items", controller.getOrderAndItems);

module.exports = orderRouter;