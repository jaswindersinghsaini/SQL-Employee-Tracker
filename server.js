const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
const PORT = process.env.PORT || 3001;
const cTable = require("console.table");

const app = express();
// Create Connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log("Database connected!!")
);

function displayDepartments() {
  const sql = "SELECT * FROM department;";
  db.query(sql, (err, res) => {
    if (err) throw err;

    console.table("Departments", res);
    handleOptions();
  });
}
// Display list of Employees
function displayEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(m.first_name, m.last_name) AS manager
  FROM employee
  JOIN roles ON employee.role_id = roles.id
  JOIN department ON roles.department_id = department.id
  LEFT OUTER JOIN employee AS m ON employee.manager_id = m.id
  ORDER BY id;`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table("Employees, Salaries, Departments, Managers", res);
    handleOptions();
  });
}
// Display list of Roles

function displayRoles() {
  const sql = `SELECT roles.id, roles.title, roles.salary, department.name AS department
  FROM roles
  JOIN department ON roles.department_id = department.id
  ORDER BY id;`;
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
    message: "Provide name of Department to add",
    validate: (deptInput) => {
      if (deptInput == "") {
        console.log("Provide name of Department to add");
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
    console.log("Department Added!!");
    handleOptions();
  });
}
// Adding New Role

async function addNewRole() {
  const sql = `SELECT * FROM department ORDER BY id;`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    const arrayDept = res;
    const listDept = arrayDept.map((item) => item.name);

    const addRole = inquirer
      .prompt([
        {
          type: "input",
          name: "newRole",
          message: "Provide Role Name to be added",
          validate: (roleInput) => {
            if (roleInput == "") {
              console.log("Provide Role Name to be added");
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
          choices: listDept,
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

        const sql1 = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
        const params = [
          newRole.newRole,
          newRole.roleSalary,
          newRole.department_id,
        ];
        db.query(sql1, params, (err, res) => {
          if (err) throw err;
          console.log("Added Role!!");
          handleOptions();
        });
      });
  });
}

// Adding New Employee

async function addNewEmployee() {
  const roleQuery = `SELECT * FROM roles ORDER BY id;`;
  db.query(roleQuery, (err, res) => {
    if (err) throw err;
    const queryRoleResp = res;
    const arrayRoles = queryRoleResp.map((role) => role.title);

    const emplQuery = `SELECT * FROM employee ORDER BY id;`;
    db.query(emplQuery, (err, res) => {
      if (err) throw err;

      const queryEmplResp = res;
      const arrayEmpl = queryEmplResp.map(
        (empl) => empl.first_name + " " + empl.last_name
      );

      const addEmployee = inquirer
        .prompt([
          {
            type: "input",
            name: "firstname",
            message: "Provide the Employee First Name",
            validate: (fnameInput) => {
              if (fnameInput == "") {
                console.log("Provide the Employee First Name");
                return false;
              } else {
                return true;
              }
            },
          },
          {
            type: "input",
            name: "lastname",
            message: "Provide the Employee Last Name",
            validate: (lnameInput) => {
              if (lnameInput == "") {
                console.log("Provide the Employee Last Name");
                return false;
              } else {
                return true;
              }
            },
          },
          {
            type: "list",
            name: "roleArray",
            message: "Choose Role for Employee",
            choices: arrayRoles,
          },
          {
            type: "list",
            name: "employeeArray",
            message: "Choose Manager for Employee",
            choices: arrayEmpl,
          },
        ])
        .then((answers) => {
          const insertRole = queryRoleResp.find(
            (role) => role.title === answers.roleArray
          );
          const selectedRoleId = insertRole.id;

          const insertMgr = queryEmplResp.find(
            (empl) =>
              empl.first_name + " " + empl.last_name === answers.employeeArray
          );
          const selectedMgrId = insertMgr.id;

          const newEmplAdd = {
            firstname: answers.firstname,
            lastname: answers.lastname,
            roleid: selectedRoleId,
            managerid: selectedMgrId,
          };

          const sqlInsert = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?);`;
          const params = [
            newEmplAdd.firstname,
            newEmplAdd.lastname,
            newEmplAdd.roleid,
            newEmplAdd.managerid,
          ];
          db.query(sqlInsert, params, (err, res) => {
            if (err) throw err;
            console.log("Employee Added!!");
            handleOptions();
          });
        });
    });
  });
}

// Updating Employee Role

async function updateEmployeeRole() {
  const sql = `SELECT * FROM roles ORDER BY id;`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    const queryRoleResp = res;
    const arrayRoles = queryRoleResp.map((roles) => roles.title);

    const emplQuery = `SELECT * FROM employee ORDER BY id;`;
    db.query(emplQuery, (err, res) => {
      if (err) throw err;

      const queryEmplResp = res;
      const arrayEmpl = queryEmplResp.map(
        (empl) => empl.first_name + " " + empl.last_name
      );

      const emplRoleUpdate = inquirer
        .prompt([
          {
            type: "list",
            name: "listEmpl",
            message: `Which Employee's role do you want to update?`,
            choices: arrayEmpl,
          },
          {
            type: "list",
            name: "listRoles",
            message: "Choose a Role to assign to the Employee",
            choices: arrayRoles,
          },
        ])

        .then((answers) => {
          const getEmplRoleTitle = queryRoleResp.find(
            (role) => role.title === answers.listRoles
          );
          const updateEmplRoleId = getEmplRoleTitle.id;
          const getEmplName = queryEmplResp.find(
            (empl) =>
              empl.first_name + " " + empl.last_name === answers.listEmpl
          );
          let selectedEmplId = getEmplName.id;
          const sqlUpdateQuery = `Update employee SET employee.role_id = ? WHERE employee.id = ? ORDER BY id;`;
          const params = [updateEmplRoleId, selectedEmplId];
          db.query(sqlUpdateQuery, params, (err, res) => {
            if (err) throw err;
            handleOptions();
          });
        });
    });
  });
}

//List of Choices
async function handleOptions() {
  const options = [
    "View All Departments",
    "Add Department",
    "View All Roles",
    "Add Role",
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
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
    process.exit();
  }
}

handleOptions();

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
