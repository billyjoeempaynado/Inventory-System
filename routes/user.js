const express = require("express"); // Import express
const userRoutes = express.Router(); // Correctly use express.Router()
const controller = require("../controllers/userController"); // Import user controller

// Define routes
userRoutes.get("/", controller.getUsers); // Get all users
userRoutes.post("/", controller.addUser); // Add a new user
userRoutes.get("/:id", controller.getUserById); // Get user by ID
userRoutes.put("/:id", controller.updateUser); // Update user by ID
userRoutes.delete("/:id", controller.deleteUser); // Delete user by ID

module.exports = userRoutes;