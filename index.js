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
            case 'quit':
            return false;
            default:
            updateEmployee();
        }
    } catch (err) {
      console.error(err);
    } finally {
      init();
    }
}

async function viewDepartments() {
    try {
      const result = await queryAsync('SELECT * FROM department');
      console.table(result);
    } catch (err) {
      console.error(err);
    }
}

function viewRoles() {
    db.query('SELECT * from roles', (err, result) => {
        console.table(result)
    })
    init()
}

function viewEmployees() {
    db.query('SELECT * from employees', (err, result) => {
        console.table(result)
    })
    init()
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the new Department?',
                name: 'department'
            }
        ])
        .then((answers) => {
            console.log(answers.department)
            /*db.query(
                `INSERT INTO department(dep_name) VALUES ('${answers.department}')`
                )*/
        })
        .then(
            init()
        ) 
    
}

init()