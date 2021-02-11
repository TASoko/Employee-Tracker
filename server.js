//Dependencies
require("dotenv").config(); //This is for the .env file that will hide my password
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
var figlet = require('figlet');

//Creating the connection between my js file and the schema I made.
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.PASSWORD,
  database: "employee_db",
});

//Actually calling the connection. The viewEmployee function is here to have all the employee information render before the prompts start.
connection.connect(function (err) {
  if (err) throw err;
  figlet('Employee Tracker', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    viewEmployee();
});
});

// The first function to begin the user experience. 
function start() {
  //The User is prompt with what they would like to do.
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add", "View", "Update", "Exit"],
    })
    //the answer to their choices is then run through a switch statement where each answer leads to a new function
    .then(function (answer) {
      switch (answer.action) {
        case "Add":
          add();
          break;

        case "View":
          view();
          break;

        case "Update":
          updateEmployee();
          break;
          // in case the user doesn't actually want to continue with the prompts
        case "Exit":
          connection.end();
          break;
      }
    });
}
// The add function prompts the user to follow through with adding information to 3 choices or ending the program.
function add() {
  inquirer
    .prompt({
      name: "add",
      type: "list",
      message: "What would you like to add to?",
      choices: ["Department", "Roles", "Employees", "Exit"],
    })
    // just like in the start function a switch statement is used to lead the user to a new function depending on their choice
    .then(function (answer) {
      switch (answer.add) {
        case "Department":
          addDepartment();
          break;

        case "Roles":
          addRoles();
          break;

        case "Employees":
          addEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

//below is the function for adding a department
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Add a department?",
    })
    .then(function (answer) {
      // to add a department we must first call on the department table then tell the function where to add information according to our table set up
      connection.query(
      // This statement is saying that insert into the table department where the informaiton required is name the value of answer.department which is what was created by the user
        "INSERT INTO department (name) VALUES (?)",
        answer.department,
        function (err) {
          if (err) throw err;
          console.log(answer.department);
          console.table(answer);
          start();
        }
      );
    });
}

//below is the function for adding a role
function addRoles() {
  //for the roles table, there are 3 fields that must be addressed, title, salary and number. The user must input all three of these.
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the role?",
      },
      {
        name: "salary",
        type: "number",
        message: "What is the person's salary?",
      },
      {
        name: "department_id",
        type: "number",
        message: "What is the department id?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, the function inserts a new item into the db with that info
      connection.query(
        "INSERT INTO roles SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function (err) {
          if (err) throw err;
          console.log("the role was created!");
          console.table(answer);

          start();
        }
      );
    });
}

//below is the function for adding an employee
function addEmployee() {
    //for the employee table, there are 4 fields that must be addressed the employee's first and last name, the role id and the manager id. The user must input all four of these.

  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role_id",
        type: "number",
        message: "What is the role id?",
      },
      {
        name: "manager_id",
        type: "number",
        message: "What is the manager id?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first,
          last_name: answer.last,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },
        function (err) {
          if (err) throw err;
          console.log("the employee was created!");
          console.table(answer)
          start();
        }
      );
    });
}

// The view function prompt the user to follow through with viewing the information of 3 choices or ending the app
function view() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "What would you like to view?",
      choices: ["Department", "Roles", "Employees", "Exit"],
    })
    //each switch statement takes the user to a new function
    .then(function (answer) {
      switch (answer.view) {
        case "Department":
          viewDepartment();
          break;

        case "Roles":
          viewRoles();
          break;

        case "Employees":
          viewEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

//below is the function for viewing the department table
function viewDepartment() {
  // The function is called in sql form and the results are put in console table which displays it for the user
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
}

//bellow is the funciton for viewing the roles table
function viewRoles() {
  // The function is called in sql form and the results are put in console table which displays it for the user
  // The way the instruction is written uses a join table to join the department table with the roles table to show what department each role is part of
  connection.query("SELECT roles.id, title, salary, department.name AS department  FROM roles LEFT JOIN department ON roles.department_id = department.id", function (err, results) {
    if (err) throw err;
    console.table(results)
    start();
  })
} 

//below is the function for view the employee table
function viewEmployee() {
    // The function is called in sql form and the results are put in console table which displays it for the user
    // The way the instruction is written it uses multiple joins becuase it has to join information from all the tables to display each piece of information in relation to the employee
  connection.query(`SELECT e.id, CONCAT(e.first_name, " ", e.last_name) 
  AS employee, roles.title, department.name 
  AS department, salary, CONCAT(m.first_name, " ", m.last_name) 
  AS manager 
  FROM employee e INNER JOIN roles ON e.role_id=roles.id 
  INNER JOIN department on roles.department_id=department.id 
  LEFT JOIN employee m ON m.id = e.manager_id; 
  `, function (err, results) {
    if (err) throw err;
    console.table(results)

    start();
  });
}

// below is the function used to update an employee which is the only function under update.
function updateEmployee() {
    
// The function is called in sql form and the results are going to be used later
  connection.query("SELECT employee.id, first_name, last_name, roles.title AS roles  FROM employee LEFT JOIN roles ON employee.role_id = roles.id", function (err, results) {
    if (err) throw err;
    console.log("At least it started");
    // once you have the items, prompt the user for which they'd like to update
    inquirer
    //The first question for this prompt is the user picking the employee. A for loop is ran to make sure the choices are all the employees currently in the system
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              //To display the employee's full name a variable was created and then pushed into an array
              let fullName = results[i].first_name + " " + results[i].last_name; 
              console.log(fullName)
              choiceArray.push(fullName);
            }
            return choiceArray;
          },
          message: "Which employee would you like to update?",
        },
        {
        //The second question for this prompt is the user picking the role to change to. A for loop is ran to make sure the choices are all the roles currently in the system
 
          name: 'updatedRole',
          type: 'list',
          choices: function () {
            var roleArray = [];
            for (var i = 0; i < results.length; i++) {
              console.log(results[i].roles)
            //The roles are then pushed into an array to display as choices
              roleArray.push(results[i].roles);
            }
            return roleArray;
          },
          message: 'What role would you like to give them?',
        }
        
      ])
      .then(function (answer) {
        // get the information of the chosen item
        // connection.query("SELECT id FROM roles WHERE title = ? ",
        // answer.updatedRole,
        //  function (err, results) {
        //   console.log(answer.updatedRole);
        //   if (err) throw err;
        
        // var chosenRole = [];
        for (var i = 0; i < results.length; i++) {
          // chosenRole.push(results[i].roles);
          // console.log(chosenRole);
          console.log("this is working")
          roleBefore = results[i].roles
          console.log(roleBefore);

          let fullName = results[i].first_name + " " + results[i].last_name; 
          console.log(fullName)
          let employee_ID = results[i].id
          console.log(employee_ID)
        // }
          // This statement states that if the answer to which employee is chosen is 
          // if (fullName === answer.choice) {

            console.log(fullName)
            console.log(employee_ID)
          //This statement states that if the new role chosen is NOT the same as the employee's original role then proceed to update the roles
            if (answer.updatedRole !== roleBefore ) {
              console.log("they don't match!")
              connection.query(
              // This statement says that update the employee table with the new role associated with the employee id
                "UPDATE employee SET roles = ? WHERE id = ?",
                [answer.updatedRole, employee_ID],
                function(error) {
                  if (error) throw err;
                console.log("Role changed successfully!");
                  start();
                }
              );
            }
            else {
              // If the new role and old role are the same then the user is told.
              console.log("The employee already has this role");
            
          }
        
  
          // } else {
          //   console.log("they don't match")
          // }
          // return chosenRole
        // }
        console.log(roleBefore)
        console.log(answer.updatedRole)
        console.log(answer.choice)
        console.log(answer)

        start();
        }
        // }
      // );
    });
  }
)}
