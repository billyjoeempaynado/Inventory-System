const express = require("express");
const productRouter = express.Router(); // Correctly use express.Router()
const controller = require("../controllers/productController"); 


productRouter.get("/", controller.getProducts);
productRouter.post("/", controller.addProduct);
productRouter.get("/:product_id", controller.getProductById);
productRouter.put("/:product_id", controller.updateProduct);
productRouter.delete("/:product_id", controller.deleteProduct);

module.exports = productRouter;