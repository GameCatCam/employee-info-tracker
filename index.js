const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');

// establishes connection to MySQL
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log('Connected to the employees_db!')
);

// allows us to turn the queries into async functions to better play with Inquirer
const queryAsync = util.promisify(db.query).bind(db);

// Main inquirer function. Starting branch of the program
async function init() {
    try {
        // Prompts for a course of action. Will lead to the following functions.
        const answers = await inquirer.prompt([
            {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'quit'
            ]
            }
        ]);
        
        // Switch/Case statement to push the user to the different functions.
        switch (answers.choice) {
            case 'view all departments':
                await viewDepartments();
                break;
            case 'view all roles':
                await viewRoles();
                break;
            case 'view all employees':
                await viewEmployees();
                break;
            case 'add a department':
                await addDepartment();
                break;
            case 'add a role':
                await addRole();
                break;
            case 'add an employee':
                await addEmployee();
                break;
            case 'update an employee role':
                await updateEmployee();
                break;
            case 'quit':
                return;
        }
    } catch (err) {
        console.error(err);
    }
    init();
}

// Views all departments
async function viewDepartments() {
    try {
      const result = await queryAsync('SELECT * FROM department')
      console.table(result)
    } catch (err) {
      console.error(err)
    }

    //console.log("Exiting viewDepartments")
}

// Views all roles and includes the department they belong to
async function viewRoles() {
    try{
        const result = await queryAsync(`
            SELECT roles.id, roles.title, roles.salary, department.dep_name
            FROM roles
            JOIN department ON roles.department_id = department.id
        `);
        console.table(result)
    } catch (err) {
        console.error(err)
    }

    //console.log("Exiting viewRoles")
}

// Views all employees and includes their roles and manager names
async function viewEmployees() {
    try {
        const result = await queryAsync(`
        SELECT 
          employees.id,
          CONCAT(employees.first_name, ' ', employees.last_name) AS name,
          roles.title AS role,
          roles.salary,
          CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN employees AS manager ON employees.manager_id = manager.id
      `);
        console.table(result)
    } catch (err) {
        console.error(err)
    }

    //console.log("Exiting viewEmployees")
}

// Creates a new department
async function addDepartment() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the new Department?',
                name: 'department'
            }
        ]);
  
        await queryAsync(`INSERT INTO department(dep_name) VALUES ('${answers.department}')`);

        console.log(`Created Department: ${answers.department}`);
    } catch (err) {
      console.error(err);
    }

    //console.log("Exiting addDepartment")
}

// Creates a new Role, and adds it to a Department
async function addRole() {
    try {
        const departments = await queryAsync('SELECT id, dep_name FROM department');
        const departmentChoices = departments.map((dept) => ({
          name: dept.dep_name,
          value: dept.id,
        }));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the new Role?',
                name: 'role'
            },
            {
                type: 'input',
                message: 'What is the salary of this role?',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'Select the department for this role:',
                name: 'dept_id',
                choices: departmentChoices,
              },
        ]);
    
        await queryAsync(
            `
                INSERT INTO roles(title, salary, department_id) 
                VALUES ('${answers.role}', '${answers.salary}', '${answers.dept_id}')`
        );

        console.log(`Created Role: ${answers.role}`);

    } catch (err) {
      console.error(err);
    }

    //console.log("Exiting addRole")
}

// Creates a new Employee, gives them a Role, and gives them a Manager.
async function addEmployee() {
    try {
        const roles = await queryAsync('SELECT id, title FROM roles')
        const rolesChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }))

        const employees = await queryAsync('SELECT id, first_name, last_name FROM employees')
        const managerChoices = employees.map((manager) => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id
        }))

        const answers = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the first name of the new Employee?',
                name: 'employeeFirst'
            },
            {
                type: 'input',
                message: 'What is the last name of the new Employee?',
                name: 'employeeLast'
            },
            {
                type: 'list',
                message: 'Select the role for this employee:',
                name: 'role_id',
                choices: rolesChoices
            },
            {
                type: 'list',
                message: 'Select the manager for this employee:',
                name: 'manager_id',
                choices: managerChoices
            }
        ]);
    
        await queryAsync(`
            INSERT INTO employees(first_name, last_name, role_id, manager_id) 
            VALUES (
                '${answers.employeeFirst}', 
                '${answers.employeeLast}', 
                '${answers.role_id}', 
                '${answers.manager_id}')
        `);
        
        console.log(`Added Employee: ${answers.employeeFirst} ${answers.employeeLast}`);
    } catch (err) {
      console.error(err);
    }

    console.log("Exiting addEmployee")
}

// Updates the role an employee has
async function updateEmployee() {
    try {
        const roles = await queryAsync('SELECT id, title FROM roles')
        const rolesChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }))

        const employees = await queryAsync('SELECT id, first_name, last_name FROM employees')
        const empChoices = employees.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }))

        const answers = await inquirer.prompt([
            {
                type: 'list',
                message: 'Which employee\'s role do you wish to change?',
                name: 'employee',
                choices: empChoices
            },
            {
                type: 'list',
                message: 'Which role are you giving them?',
                name: 'role',
                choices: rolesChoices
            }
        ]);
    
        await queryAsync(`
            UPDATE employees
            SET role_id = ${answers.role}
            WHERE id = ${answers.employee} 
        `);
        
        console.log(`Updated role!`);
    } catch (err) {
        console.error(err);
    }

    //console.log("Exiting updateEmployee")
}

init()