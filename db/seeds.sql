INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales"); 


INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Khoa", "Nguyen", 1, NULL),
       ("Rolyn", "Palma", 2, 1),
       ("Sixto", "Alvarado", 3, 1),
       ("Kalli", "Rai", 4, 2),
       ("Jose", "Alvarado", 5, 2),
       ("Carlo", "DelaCruz", 6, 3),
       ("Tom", "Coonce", 7, 3),
       ("Joel", "MC", 8, 4); 
