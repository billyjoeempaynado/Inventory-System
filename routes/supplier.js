const express = require("express");
const supplierRouter = express.Router(); // Correctly use express.Router()
const controller = require("../controllers/supplierController");

const router = express.Router();

supplierRouter.get("/", controller.getSuppliers);
supplierRouter.post("/", controller.addSupplier);
supplierRouter.get("/:supplier_id", controller.getSupplierById);
supplierRouter.put("/:supplier_id", controller.updateSupplier);
supplierRouter.delete("/:supplier_id", controller.deleteSupplier);

module.exports = supplierRouter;