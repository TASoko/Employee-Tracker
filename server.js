//Dependencies
require("dotenv").config(); //This is for the .env file that will hide my password
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
var figlet = require('figlet');

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

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add", "View", "Update", "Exit"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add":
          add();
          break;

        case "View":
          view();
          break;

        case "Update":
          update();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function add() {
  inquirer
    .prompt({
      name: "add",
      type: "list",
      message: "What would you like to add to?",
      choices: ["Department", "Roles", "Employees", "Exit"],
    })
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

function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Add a department?",
    })
    .then(function (answer) {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        answer.department,
        function (err) {
          if (err) throw err;
          console.log(answer.department);
          start();
        }
      );
    });
}

function addRoles() {
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
      // when finished prompting, insert a new item into the db with that info
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
          var value = [
            [answer.title, answer.salary, answer.department_id],
          ];
          console.table(["Title", "Salary", "Department ID"], value);
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function addEmployee() {
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
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function view() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "What would you like to view?",
      choices: ["Department", "Roles", "Employees", "Exit"],
    })
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

function viewDepartment() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
}

function viewRoles() {
  connection.query("SELECT roles.id, title, salary, department.name AS department  FROM roles LEFT JOIN department ON roles.department_id = department.id", function (err, results) {
    if (err) throw err;
    console.table(results)
    start();
  })
} 

function viewEmployee() {
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

function update() {
  inquirer
    .prompt({
      name: "update",
      type: "list",
      message: "What would you like to update?",
      choices: ["Department", "Roles", "Employees", "Exit"],
    })
    .then(function (answer) {
      switch (answer.update) {
        case "Department":
          updataeDepartment();
          break;

        case "Roles":
          updateRoles();
          break;

        case "Employees":
          updateEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function updateEmployee() {
  // query the database for all items being auctioned
  connection.query("SELECT employee.id, first_name, last_name, roles.title AS roles  FROM employee LEFT JOIN roles ON employee.role_id = roles.id", function (err, results) {
    if (err) throw err;
    console.log("At least it started");
    // once you have the items, prompt the user for which they'd like to update
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              let fullName = results[i].first_name + " " + results[i].last_name; 
              console.log(fullName)
              choiceArray.push(fullName);
            }
            return choiceArray;
          },
          message: "Which employee would you like to update?",
        },
        {
          name: 'updatedRole',
          type: 'list',
          choices: function () {
            var roleArray = [];
            for (var i = 0; i < results.length; i++) {
              console.log(results[i].roles)
              roleArray.push(results[i].roles);
            }
            return roleArray;
          },
          message: 'What role would you like to give them?',
        }
        
      ])
      .then(function (answer) {
        // get the information of the chosen item

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

          if (fullName === answer.choice) {

            console.log(fullName)
            console.log(employee_ID)

            if (answer.updatedRole !== roleBefore ) {
              console.log("they don't match!")
              connection.query(
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
              // bid wasn't high enough, so apologize and start over
              console.log("Try again...");
            
          }
  
          } else {
            console.log("they don't match")
          }
          // return chosenRole
        // }
        // console.log(results)
        console.log(roleBefore)
        // console.log(employee_ID)
        // console.log(fullName)
        console.log(answer.updatedRole)
        console.log(answer.choice)
        console.log(answer)


        //   if (answer.updatedRole !== chosenRole ) {
        //     connection.query(
        //       "UPDATE employee SET role = ? WHERE id = ?",
        //       [answer.updatedRole, employee_ID],
        //       function(error) {
        //         if (error) throw err;
        //       console.log("Role changed successfully!");
        //         start();
        //       }
        //     );
        //   }
        //   else {
        //     // bid wasn't high enough, so apologize and start over
        //     console.log("Try again...");
  

        //     // console.table(results)
          
        // }
        start();
        }
      });
  });
}
