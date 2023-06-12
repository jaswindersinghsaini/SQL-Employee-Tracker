const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'

},
console.log('database connected')
);


function displayDepartments() {
  const sql = "SELECT * FROM department;";
  db.query(sql, (err, res) => {
    if(err) throw(err); 
    console.table(res);
    });
}

function displayEmployees() {
  const sql = `SELECT employee.id, first_name, last_name, 
  role.title, department.name AS department, role.salary 
  FROM employee 
  JOIN role ON employee.role_id = role.id 
  JOIN department ON role.department_id = department.id;`;
  db.query(sql, (err, res) => {
    if(err) throw(err); 
    console.table(res);
    });
}

function displayRoles() {
    const sql = "SELECT * FROM role;";
    db.query(sql, (err, res) => {
      if(err) throw(err); 
      console.table(res);
      });
  }

async function handleOptions() {
  const options = [
    "View All Departments",
    "Add Department",
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
    "View All Roles",
    "Add Role",
    "Quit"
  ];

  const results = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: options,
    },
  ]);
  if (results.choice == "View All Departments") {
    displayDepartments();
    handleOptions();
  } else if (results.choice == "View All Employees") {
    displayEmployees();
    handleOptions();
  } else if (results.choice == "View All Roles") {
    displayRoles();
    handleOptions();
  } else if (results.choice == "Add Department") {
    addDepartment();
    handleOptions();
  } else if (results.choice == "Add Employee") {
    addEmployee();
    handleOptions();
  } else if (results.choice == "Update Employee Role") {
    updateEmployee();
    handleOptions();
  } else if (results.choice == "Add Role") {
    addRole();
    handleOptions();
  } else if (results.choice == "Quit") {
    handleOptions();
  }
}

handleOptions();



app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})
