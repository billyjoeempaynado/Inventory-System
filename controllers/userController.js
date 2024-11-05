const pool = require("../db");
const userQueries = require("../models/userQueries");

const getUsers = (req, res) => {
  pool.query(userQueries.getUsers, (error, results) => {
    if (error) throw error;
      res.status(200).json(results.rows);  
  })
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(userQueries.getUserById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addUser = (req, res) => {
  const { name, email, password } = req.body;

  

  pool.query(userQueries.addUser, [name, email, password], (error, results) => {
    if (error) throw error;
    res.status(201).send("User Created Successfully!"); 
  });

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
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(userQueries.getUserById, [id], (error, results) =>{
          const noUserFound = !results.rows.length;
          if (noUserFound) {
          return res.status(404).send("User does not exist in the database");
        }

        pool.query(userQueries.deleteUser, [id], (error, results) => {
          if (error) throw error;
          res.status(200).send("User removed successfully.");
        })
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const {name} = req.body;

  pool.query(userQueries.getUserById, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      return res.status(404).send("User does not exist in the database");
     }

     pool.query(userQueries.updateUser, [name, id], (error,results) => {
      if (error) throw error;
      res.status(200).send("Update updated succesfully");
     });
  });
};



module.exports = {
  getUsers,
  getUserById,
  addUser,
  deleteUser,
  updateUser
};