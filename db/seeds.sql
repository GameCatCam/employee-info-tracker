USE employees_db;

INSERT INTO department (dep_name)
VALUES ("Sales"),
       ("Shipping"),
       ("Development");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Associate", 10.50, 1),
       ("Sales Manager", 18.50, 1),
       ("Shipping Loader", 15.50, 2),
       ("Shipping Manager", 18.00, 2),
       ("Development Researcher", 16.50, 3),
       ("Building Manager", 22.50, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Charles", "Incharge", 1, 2),
       ("Cheers", "Knowsyourname", 2, 6),
       ("Mega", "Man", 3, 4),
       ("Proto", "Man", 4, 6),
       ("Goku", "Solos", 5, 6),
       ("Thebig", "Man", 6, NULL),
       ("Other", "Name", 1, 2),
       ("More", "Name", 1, 2),
       ("Onemore", "Guy", 3, 4);