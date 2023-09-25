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

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Charles", "Incharge", 1, 2),
       (2, "Cheers", "Knowsyourname", 2, 6),
       (3, "Mega", "Man", 3, 4),
       (4, "Proto", "Man", 4, 6),
       (5, "Goku", "Solos", 5, 6),
       (6, "Thebig", "Man", 6, NULL),
       (7, "Other", "Name", 1, 2),
       (8, "More", "Name", 1, 2),
       (9, "Onemore", "Guy", 3, 4);