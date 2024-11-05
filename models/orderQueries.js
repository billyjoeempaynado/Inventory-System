const getOrders = "SELECT * FROM orders";
const getOrderById =  `SELECT o.*, oi.product_id, oi.quantity, oi.price, p.product_name 
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.product_id
WHERE o.order_id = $1`;
const addOrder = "INSERT INTO orders (customer_name, order_date, status, total_amount) VALUES ($1, $2, $3, $4) RETURNING order_id";
const deleteOrder = "DELETE FROM orders WHERE order_id = $1";
const addOrderItem = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)";
const updateOrderAndItems = "UPDATE order_items SET quantity = $1, price = $2 WHERE order_id = $3 AND product_id = $4";
const updateTotalAmount = "UPDATE orders SET total_amount = (SELECT SUM(quantity * price) FROM order_items WHERE order_id = $1) WHERE order_id = $1";
const getOrderAndItems = "SELECT * FROM order_items WHERE order_id = $1";

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  deleteOrder,
  addOrderItem,
  updateTotalAmount,
  updateOrderAndItems,
  getOrderAndItems // New query for updating total_amount
};