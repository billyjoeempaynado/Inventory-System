
const getSuppliers = "SELECT * FROM suppliers";
const getSupplierById = "SELECT * FROM suppliers WHERE supplier_id = $1";
const addSupplier = "INSERT INTO suppliers (supplier_name, contact_person, phone_number, supplier_email, supplier_address) VALUES ($1, $2, $3, $4, $5)";
const updateSupplier = "UPDATE suppliers SET supplier_name = $1, contact_person = $2, phone_number = $3, supplier_email = $4, supplier_address = $5 WHERE supplier_id = $6";
const deleteSupplier = "DELETE FROM suppliers WHERE supplier_id = $1";

// const checkEmailExist = "SELECT s FROM TABLE_NAME s WHERE s.email = $1";
// const addStudent = "INSERT INTO TABLE_NAME (name, email, age, dob) VALUES ($1, $2, $3, $4)";

module.exports = {
  getSuppliers,
  getSupplierById,
  addSupplier,
  deleteSupplier,
  updateSupplier
  // checkEmailExist,
  // addStudent
};