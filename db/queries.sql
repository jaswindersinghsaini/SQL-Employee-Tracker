SELECT employee.id, first_name, last_name, role.title, department.name AS department, role.salary
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

