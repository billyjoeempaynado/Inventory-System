const pool = require("../db");
const queries = require("../models/productQueries");

const getProducts = (req, res) => {
  pool.query(queries.getProducts, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results.rows);
  });
};

const getProductById = (req, res) => {
  const product_id = parseInt(req.params.product_id);
  pool.query(queries.getProductById, [product_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve product" });
    }
    res.status(200).json(results.rows);
  });
};

const addProduct = (req, res) => {
  const {product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level, product_code } = req.body;

  // Log the entire request body for debugging
  console.log("Request Body:", req.body);

  // Validate required fields
  if (!product_name || !purchase_price) {
    return res.status(400).json({ error: "Product name and purchase price are required" });
  }

  // Proceed with inserting product if validation passes
  pool.query(queries.addProduct, [product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level, product_code], (error, results) => {
    if (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ error: "Failed to add product" });
    }

    res.status(201).json({ message: "Product Created Successfully!", product: req.body });
  });
};

const deleteProduct = (req, res) => {
  const product_id = parseInt(req.params.product_id);

  // Check if order exists
  pool.query(queries.getProductById, [product_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve Product" });
    }

    const noProductFound = !results.rows.length;
    if (noProductFound) {
      return res.status(404).send("Product does not exist in the database");
    }

    // Step 1: Delete order items associated with the order
    pool.query(`DELETE FROM order_items WHERE product_id = $1`, [product_id], (error) => {
      if (error) {
        return res.status(500).json({ error: "Failed to remove order items" });
      }

      // Step 2: Now delete the order itself
      pool.query(queries.deleteProduct, [product_id], (error) => {
        if (error) {
          return res.status(500).json({ error: "Failed to remove Product" });
        }
        res.status(200).send("Product removed successfully.");
      });
    });
  });
};


const updateProduct = (req, res) => {
  const product_id = parseInt(req.params.product_id);
  const {  product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level, product_code } = req.body;

  // Check if all required fields are provided
  if (!product_code || !product_name || !purchase_price || !selling_price || !category_id || !supplier_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  pool.query(queries.getProductById, [product_id], (error, results) => {
    if (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ error: "Failed to fetch product" });
    }

    const noItemFound = !results.rows.length;
    if (noItemFound) {
      return res.status(404).send("Product does not exist in the database");
    }

    pool.query(queries.updateProduct, 
      [product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level, product_code, product_id], 
      (error, results) => {
        if (error) {
          console.error("Error updating product:", error);
          return res.status(500).json({ error: "Failed to update product" });
        }
        res.status(200).send("Product updated successfully");
      });
  });
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
};
