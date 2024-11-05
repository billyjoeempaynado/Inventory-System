const pool = require("../db");
const queries = require("../models/orderQueries");

const getOrders = (req, res) => {
  pool.query(queries.getOrders, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve Order" });
    }
    res.status(200).json(results.rows);
  });
};


const getOrderAndItems = (req, res) => {
  const order_id = parseInt(req.params.order_id); // Get order_id from request parameters
  pool.query(queries.getOrderAndItems, [order_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve order items" });
    }
    res.status(200).json(results.rows);
  });
};



const getOrderById = (req, res) => {
  const order_id = parseInt(req.params.order_id);
  pool.query(
    `SELECT o.*, oi.product_id, oi.quantity, oi.price, p.product_name 
     FROM orders o
     LEFT JOIN order_items oi ON o.order_id = oi.order_id
     LEFT JOIN products p ON oi.product_id = p.product_id
     WHERE o.order_id = $1`,
    [order_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Failed to retrieve Order" });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Structure the response
      const order = {
        order_id: results.rows[0].order_id,
        customer_name: results.rows[0].customer_name,
        order_date: results.rows[0].order_date,
        status: results.rows[0].status,
        total_amount: results.rows[0].total_amount,
        items: results.rows.map(row => ({
          product_id: row.product_id,
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price
        }))
      };
      res.status(200).json(order);
    }
  );
};




const addOrder = async (req, res) => {
  const { customer_name, order_date, status, items } = req.body; // Include items in the request

  // Validate required fields
  if (!customer_name || !order_date) {
    return res.status(400).json({ error: "Customer name and order date are required" });
  }

  const client = await pool.connect();
  let totalAmount = 0;

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Insert the order and retrieve the order_id
    const orderResult = await client.query(
      "INSERT INTO orders (customer_name, order_date, status, total_amount) VALUES ($1, $2, $3, $4) RETURNING order_id",
      [customer_name, order_date, status, 0] // Initially set total_amount to 0
    );
    const order_id = orderResult.rows[0].order_id;

    // If items were passed, add them and calculate totalAmount
    if (items && items.length > 0) {
      for (const item of items) {
        const { product_id, quantity, price } = item;
        totalAmount += quantity * price;

        // Insert items into order_items table
        await client.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [order_id, product_id, quantity, price]
        );
      }

      // Update the order with the correct total_amount
      await client.query(
        "UPDATE orders SET total_amount = $1 WHERE order_id = $2",
        [totalAmount, order_id]
      );
    }

    // Commit transaction
    await client.query('COMMIT');
    res.status(201).json({ message: "Order and items created successfully", order_id, total_amount: totalAmount });
  } catch (error) {
    // Rollback transaction in case of error
    await client.query('ROLLBACK');
    console.error("Error adding order and items:", error);
    res.status(500).json({ error: "Failed to add order and items" });
  } finally {
    client.release();
  }
};




const deleteOrder = (req, res) => {
  const order_id = parseInt(req.params.order_id);

  // Check if order exists
  pool.query(queries.getOrderById, [order_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve order" });
    }

    const noOrderFound = !results.rows.length;
    if (noOrderFound) {
      return res.status(404).send("Order does not exist in the database");
    }

    // Step 1: Delete order items associated with the order
    pool.query(`DELETE FROM order_items WHERE order_id = $1`, [order_id], (error) => {
      if (error) {
        return res.status(500).json({ error: "Failed to remove order items" });
      }

      // Step 2: Now delete the order itself
      pool.query(queries.deleteOrder, [order_id], (error) => {
        if (error) {
          return res.status(500).json({ error: "Failed to remove Order" });
        }
        res.status(200).send("Order removed successfully.");
      });
    });
  });
};


const updateOrderAndItems = async (req, res) => {
  const order_id = parseInt(req.params.order_id);
  const { customer_name, order_date, status, items } = req.body;
  console.log('Received request to update order items:', req.body); // Log the incoming request

  if (!customer_name || !order_date || !status) {
    return res.status(400).json({ error: "Missing required fields: customer_name, order_date, or status" });
  }

  // Ensure items are present
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item" });
  }

  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Update the order in the "orders" table
    await client.query(
      "UPDATE orders SET customer_name = $1, order_date = $2, status = $3 WHERE order_id = $4",
      [customer_name, order_date, status, order_id]
    );

    // Calculate the new total amount for the order
    let totalAmount = 0;

    // Upsert (insert or update) order items
    for (const item of items) {
      const { product_id, quantity, price } = item;

      // Compute total amount for the current item
      totalAmount += quantity * price;

      // Insert or update the order item
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (order_id, product_id) 
         DO UPDATE SET quantity = $3, price = $4`,
        [order_id, product_id, quantity, price]
      );
    }

    // Update the total amount in the "orders" table
    await client.query(
      "UPDATE orders SET total_amount = $1 WHERE order_id = $2",
      [totalAmount, order_id]
    );

    // Commit the transaction
    await client.query('COMMIT');
    res.status(200).json({ message: "Order and items updated successfully", total_amount: totalAmount });
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error("Error updating order and items:", error);
    res.status(500).json({ error: "Failed to update order and items" });
  } finally {
    client.release();
  }
};




const addOrderItem = (req, res) => {
  const order_id = parseInt(req.params.order_id);
  const { product_id, quantity, price } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  pool.query(queries.addOrderItem, [order_id, product_id, quantity, price], (error) => {
    if (error) {
      return res.status(500).json({ error: "Failed to add order item" });
    }

    // Recalculate the total amount after adding the item
    pool.query(queries.updateTotalAmount, [order_id], (error) => {
      if (error) {
        return res.status(500).json({ error: "Failed to update total amount" });
      }

      res.status(201).json({ message: "Order item added and total amount updated successfully" });
    });
  });
};


module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  deleteOrder,
  updateOrderAndItems,
  addOrderItem,
  getOrderAndItems


};