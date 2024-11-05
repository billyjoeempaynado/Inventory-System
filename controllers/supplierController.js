const pool = require("../db");
const queries = require("../models/supplierQueries");

const getSuppliers = (req, res) => {
  pool.query(queries.getSuppliers, (error, results) => {
    if (error) throw error;
      res.status(200).json(results.rows);  
  })
};

const getSupplierById = (req, res) => {
  const supplier_id = parseInt(req.params.supplier_id);
  pool.query(queries.getSupplierById, [supplier_id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addSupplier = (req, res) => {
  const { supplier_name, contact_person, phone_number, supplier_email, supplier_address } = req.body;

  console.log("Request Body:", req.body);  // Log the entire request body

  if (!supplier_name || !contact_person || !phone_number || !supplier_email || !supplier_address) {
    return res.status(400).json({ error: "Supplier Fields are required" });
  }9

  pool.query(queries.addSupplier, [supplier_name, contact_person, phone_number, supplier_email, supplier_address], (error, results) => {
    if (error) throw error;
    res.status(201).send("Supplier Created Successfully!");
  });
};

  // for email check if email exist
  // pool.query(queries.checkEmailExist, [email], (error, results) => {
  //   if (results.rows.length) {
  //       res.send("Email already exists.");
  //   }
          // add student to db
          // pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
              //if (error) throw error;
              // res.status(201).send("Student Created Successfully!");  
          //});
  // });

const deleteSupplier = (req, res) => {
    const supplier_id = parseInt(req.params.supplier_id);

    pool.query(queries.getSupplierById, [supplier_id], (error, results) =>{
          const noSupplierFound = !results.rows.length;
          if (noSupplierFound) {
          res.send("Supplier does not exist in the database");
        }

        pool.query(queries.deleteSupplier, [supplier_id], (error, results) => {
          if (error) throw error;
          res.status(200).send("Supplier removed successfully.");
        })
    });
};

const updateSupplier = (req, res) => {
  const supplier_id = parseInt(req.params.supplier_id);
  const {supplier_name, contact_person, phone_number, supplier_email, supplier_address} = req.body;

  pool.query(queries.getSupplierById, [supplier_id], (error, results) => {
    const noSupplierFound = !results.rows.length;
    if (noSupplierFound) {
    res.send("Supplier does not exist in the database");
     }

     pool.query(queries.updateSupplier, [supplier_name, contact_person, phone_number, supplier_email, supplier_address, supplier_id], (error,results) => {
      if (error) throw error;
      res.status(200).send("Supplier updated succesfully");
     });
  });
};




module.exports = {
  getSuppliers,
  getSupplierById,
  addSupplier,
  deleteSupplier,
  updateSupplier
};