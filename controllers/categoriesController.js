const pool = require("../db");
const queries = require("../models/categoriesQueries");

const getCategories = (req, res) => {
  pool.query(queries.getCategories, (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack);
      return res.status(500).json({ error: "Database query error" });
    }
    res.status(200).json(results.rows);
  });
};


const getCategoryById = async (req, res) => {
  const category_id = parseInt(req.params.category_id);
  try {
    const results = await pool.query(queries.getCategoryById, [category_id]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Add a new category
const addCategories = (req, res) => {
  const { category_name } = req.body;
  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  pool.query(queries.addCategories, [category_name], (error, results) => {
    if (error) {
      console.error('Error adding category:', error);
      return res.status(500).json({ error: 'Failed to add category' });
    }
    res.status(201).json({ message: 'Category created successfully!' });
  });
};

// Update a category
const updateCategory = (req, res) => {
  const category_id = parseInt(req.params.category_id);
  const { category_name } = req.body;
  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  pool.query(queries.updateCategory, [category_name, category_id], (error, results) => {
    if (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({ error: 'Failed to update category' });
    }
    res.status(200).json({ message: 'Category updated successfully!' });
  });
};

// Delete a category
const deleteCategory = (req, res) => {
  const category_id = parseInt(req.params.category_id);
  pool.query(queries.deleteCategory, [category_id], (error, results) => {
    if (error) {
      console.error('Error deleting category:', error);
      return res.status(500).json({ error: 'Failed to delete category' });
    }
    res.status(200).json({ message: 'Category deleted successfully!' });
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategories,
  updateCategory,
  deleteCategory,
};