//Dependencies
require('dotenv').config() //This is for the .env file that will hide my password
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.PASSWORD,
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function start () {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add",
        "View",
        "Update",
        "Exit"
      ]
    })
    .then(function(answer) {
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

function add () {
    inquirer
      .prompt({
        name: "add",
        type: "list",
        message: "What would you like to add to?",
        choices: [
          "Department",
          "Roles",
          "Employees",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
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
  
  function addDepartment () {
    inquirer
      .prompt({
        name: "department",
        type: "input",
        message: "Add a department?",
       })
      .then(function(answer) {
     connection.query("SELECT * FROM department WHERE ?", { song: answer.song }, function(err, res) {

       
      });
  }
  



















// function addEmployee() {
//   inquirer
//     .prompt({
//       name: "employee",
//       type: "input",
//       message: "?"
//     })
//     .then(function(answer) {
//       var query = "SELECT position, song, year FROM top5000 WHERE ?";
//       connection.query(query, { artist: answer.artist }, function(err, res) {
//         if (err) throw err;
//         for (var i = 0; i < res.length; i++) {
//           console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//         }
//         start();
//       });
//     });
// }
  

// function viewEmployees() {
//   var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//   connection.query(query, function(err, res) {
//     if (err) throw err;
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].artist);
//     }
//     start();
//   });
// }

// function updateEmployeemaybe() {
//   inquirer
//     .prompt([
//       {
//         name: "start",
//         type: "input",
//         message: "Enter starting position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       },
//       {
//         name: "end",
//         type: "input",
//         message: "Enter ending position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [answer.start, answer.end], function(err, res) {
//         if (err) throw err;
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             "Position: " +
//               res[i].position +
//               " || Song: " +
//               res[i].song +
//               " || Artist: " +
//               res[i].artist +
//               " || Year: " +
//               res[i].year
//           );
//         }
//         start();
//       });
//     });
// }

// function updateEmployee() {
//   inquirer
//     .prompt({
//       name: "update-employee",
//       type: "input",
//       message: "Who would you like to update?"
//     })
//     .then(function(answer) {
//       console.log(answer);
//       connection.query("SELECT * FROM employee WHERE ?", { song: answer.song }, function(err, res) {
//         if (err) throw err;
//         console.log(
//           "Position: " +
//             res[0].position +
//             " || Song: " +
//             res[0].song +
//             " || Artist: " +
//             res[0].artist +
//             " || Year: " +
//             res[0].year
//         );
//         start();
//       });
//     });
// }
