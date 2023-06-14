const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
const PORT = process.env.PORT || 3001;
const cTable = require("console.table");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log("database connected")
);

function displayDepartments() {
  const sql = "SELECT * FROM department;";
  db.query(sql, (err, res) => {
    if (err) throw err;

    console.table("Departments", res);
    handleOptions();
  });
}

function displayEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(m.first_name, m.last_name) AS manager
  FROM employee
  JOIN roles ON employee.role_id = roles.id
  JOIN department ON roles.department_id = department.id
  LEFT OUTER JOIN employee AS m ON employee.manager_id = m.id;`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table("Employees, Salaries, Departments, Managers", res);
    handleOptions();
  });
}

function displayRoles() {
  const sql = `SELECT roles.id, roles.title, roles.salary, department.name AS department
  FROM roles
  JOIN department ON roles.department_id = department.id;`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table("Roles", res);
    handleOptions();
  });
}

async function addNewDepartment() {
  const addDepartment = await inquirer.prompt({
    type: "input",
    name: "addDeptType",
    message: "Provide name to add Department",
    validate: (deptInput) => {
      if (deptInput == "") {
        console.log("Provide name to add Department");
        return false;
      } else {
        return true;
      }
    },
  });
  const sql = `INSERT INTO department (name) VALUES (?)`;
  const params = addDepartment.addDeptType;

  db.query(sql, params, (err, result) => {
    if (err) throw err;
    console.log("Department Added");
    handleOptions();
  });
}

async function addNewRole() {
  const sql = "SELECT * FROM department;";
  db.query(sql, (err, res) => {
    if (err) throw err;
    const arrayDept = res.map((item) => item.name);
    const addRole = inquirer
      .prompt([
        {
          type: "input",
          name: "newRole",
          message: "Provide Role Name to add",
          validate: (roleInput) => {
            if (roleInput == "") {
              console.log("Provide a name of Role to be added");
              return false;
            } else {
              return true;
            }
          },
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Provide a salary for the Role",
          validate: (roleSalary) => {
            if (roleSalary == "") {
              console.log("Provide a salary for the Role");
              return false;
            } else {
              return true;
            }
          },
        },
        {
          type: "list",
          name: "listChoice",
          message: "Select a Department",
          choices: arrayDept,
        },
      ])
      .then((answers) => {
        const selectDept = arrayDept.find(
          (department) => department.name === answers.listChoice
        );
        const newRole = {
          newRole: answers.newRole,
          roleSalary: answers.roleSalary,
          department_id: selectDept.id,
        };
        console.log(
          newRole.newRole,
          newRole.roleSalary,
          newRole.department_id
        );
        const sql1 = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        const params = [
          newRole.newRole,
          newRole.roleSalary,
          newRole.department_id,
        ];
        db.query(sql1, params, (err, res) => {
          if (err) throw err;
          console.log("Added Role");
          handleOptions();
        });
      });
  });
}

async function addNewEmployee(){
    const roleQuery = "SELECT * FROM roles;";
        db.query(roleQuery, (err, res) => {
            if (err) throw err;
            const arrayRole = res.map((item) => item.title);
    
       
    const addEmployee = inquirer.prompt ([
        {
            type: 'input',
            name: 'firstname',
            message: 'Provide the Employee First Name',
            validate: (empInput) => {
                if(empInput == ''){
                    console.log('Provide the Employee First Name');
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
                type: 'input',
                name: 'lastname',
                message: 'Provide the Employee Last Name',
                validate: (empInput) => {
                    if(empInput == ''){
                        console.log('Provide the Employee Last Name');
                        return false;
                    } else {
                        return true;
                    }
                }
        },
        {
                type: 'list',
                name: 'roleArray',
                message: "Choose Role for Employee",
                choices: arrayRole,
        },
    
    ]);
        
        
});
    

    // const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    //          VALUES (?) `;
    // const params =

};

// function updateEmployeeRole();

async function handleOptions() {
  const options = [
    "View All Departments",
    "Add Department",
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
    "View All Roles",
    "Add Role",
    "Quit",
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
  } else if (results.choice == "View All Employees") {
    displayEmployees();
  } else if (results.choice == "View All Roles") {
    displayRoles();
  } else if (results.choice == "Add Department") {
    addNewDepartment();
  } else if (results.choice == "Add Employee") {
    addNewEmployee();
  } else if (results.choice == "Update Employee Role") {
    updateEmployeeRole();
  } else if (results.choice == "Add Role") {
    addNewRole();
  } else if (results.choice == "Quit") {
    end.process;
  }
}

handleOptions();

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
