
const getProducts = `
SELECT 
    p.product_id,  
    p.product_name, 
    p.description, 
    p.category_id, 
    c.category_name, 
    s.supplier_name, 
    p.purchase_price, 
    p.selling_price, 
    p.quantity_instock, 
    p.reorder_level,
    p.product_code
FROM 
    products p
LEFT JOIN 
    suppliers s ON p.supplier_id = s.supplier_id
LEFT JOIN 
    categories c ON p.category_id = c.category_id;
`;
const getProductById = "SELECT * FROM products WHERE product_id = $1";
const addProduct = "INSERT INTO products (product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level, product_code ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
const updateProduct = "UPDATE products SET product_name = $1, purchase_price = $2, description = $3, category_id = $4, supplier_id = $5, selling_price = $6, quantity_instock = $7, reorder_level = $8, product_code = $9 WHERE product_id = $10";
const deleteProduct = "DELETE FROM products WHERE product_id = $1";

// const checkEmailExist = "SELECT s FROM TABLE_NAME s WHERE s.email = $1";
// const addStudent = "INSERT INTO TABLE_NAME (name, email, age, dob) VALUES ($1, $2, $3, $4)";

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct
  // checkEmailExist,
  // addStudent
};