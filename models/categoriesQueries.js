
const getCategories = "SELECT * FROM categories";
const getCategoryById = "SELECT * FROM categories WHERE category_id = $1";  // Corrected column name
const addCategories = "INSERT INTO categories (category_name) VALUES ($1)";
const updateCategory = "UPDATE categories SET category_name = $1 WHERE category_id = $2";
const deleteCategory = "DELETE FROM categories WHERE category_id = $1";



module.exports = {
getCategories,
getCategoryById,
addCategories,
deleteCategory,
updateCategory
};