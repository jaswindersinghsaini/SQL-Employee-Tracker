-- SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(m.first_name, m.last_name) AS manager
-- FROM employee
-- JOIN roles ON employee.role_id = roles.id
-- JOIN department ON roles.department_id = department.id
-- LEFT OUTER JOIN employee AS m ON employee.manager_id = m.id;

-- SELECT roles.id, roles.title, roles.salary, department.name AS department
-- FROM roles
-- JOIN department ON roles.department_id = department.id;


SELECT  CONCAT(m.first_name, m.last_name) AS manager, roles.title
FROM employee

JOIN employee AS m ON employee.manager_id = m.id
LEFT OUTER JOIN roles ON employee.role_id = roles.id;
