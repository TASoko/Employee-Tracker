//Dependencies
require('dotenv').config(); //This is for the .env file that will hide my password
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
  start();
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
  
  function addDepartment () {
    inquirer
      .prompt({
        name: "department",
        type: "input",
        message: "Add a department?",
       })
      .then(function(answer) {
     connection.query("INSERT INTO department (name) VALUES (?)",
      { name: answer.department},
       function(err) {
        if (err) throw err;
         console.log(answer.department);
      start ();
       }
      )});
    }