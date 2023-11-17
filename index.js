const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log('Connected to the employees_db!')
);

const queryAsync = util.promisify(db.query).bind(db);

async function init() {
    try {
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
                updateEmployee();
                break;
            case 'quit':
                return;
        }
    } catch (err) {
        console.error(err);
    }
    init();
}

async function viewDepartments() {
    try {
      const result = await queryAsync('SELECT * FROM department')
      console.table(result)
    } catch (err) {
      console.error(err)
    }
}

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
}

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
}

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
}

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
}

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
}

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
    } finally {
        init();
    }
}


init()