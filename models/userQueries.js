const getUsers = "SELECT * FROM users";
const getUserById = "SELECT * FROM users WHERE id = $1";
const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
const updateUser = "UPDATE users SET name = $1 WHERE id = $2";
const deleteUser = "DELETE FROM users WHERE id = $1";
// const checkEmailExist = "SELECT s FROM TABLE_NAME s WHERE s.email = $1";
// const addStudent = "INSERT INTO TABLE_NAME (name, email, age, dob) VALUES ($1, $2, $3, $4)";

module.exports = {
  getUsers,
  getUserById,
  addUser,
  deleteUser,
  updateUser
  // checkEmailExist,
  // addStudent
};