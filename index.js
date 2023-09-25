const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log('Connected to the employees_db!')
);

function viewDepartments() {
    db.query('SELECT * FROM department', (err, result) => {
            console.log(result)
        })
}

function init() {
    db.query('SELECT * FROM department', (err, result) => {
        console.log(result)
    })
}

/*function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Welcome to Employee Database! What would you like to do?',
                name: 'choice',
                choices: [
                    'view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role'
                ]
            }
        ])
        .then((answers) => {
            if (`${answers.choice}` === 'view all departments') {
                viewDepartments();
            } else if (`${answers.choice}` === 'view all roles') {
                viewRoles();
            } else if (`${answers.choice}` === 'view all employees') {
                viewEmployees();
            } else if (`${answers.choice}` === 'add a department') {
                addEmployee();
            } else if (`${answers.choice}` === 'add a role') {
                addRole();
            } else if (`${answers.choice}` === 'add an employee') {
                addEmployee();
            } else {
                updateEmployee();
            }
        })
}*/

init()