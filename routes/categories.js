const express = require("express");
const categoryRouter = express.Router();
const controller = require("../controllers/categoriesController");

// Correct routes without any typos
categoryRouter.get("/", controller.getCategories);
categoryRouter.post("/", controller.addCategories);
categoryRouter.get("/:category_id", controller.getCategoryById);
categoryRouter.put("/:category_id", controller.updateCategory);
categoryRouter.delete("/:category_id", controller.deleteCategory);


module.exports = categoryRouter;