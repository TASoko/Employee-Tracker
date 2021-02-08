DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
id INT auto_increment PRIMARY KEY,
name varChar (30) not null
);

CREATE TABLE roles (
id  INT AUTO_INCREMENT PRIMARY KEY, 
title varChar (30) not null,
salary DECIMAL (10, 2) not null,
department_id INT not null 
-- FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
id INT PRIMARY KEY,
first_name varChar (30) not null,
last_name varChar (30) not null,
role_id INT not null,
manager_id INT null
);

INSERT INTO department (name) VALUES ("Legal");
INSERT INTO department (name) VALUES ("Human Resources");
INSERT INTO department (name) VALUES ("Accounting");

SELECT * FROM department;

INSERT INTO roles (title, salary, department_id) VALUES ("Partner", 95000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ("Head of HR", 90000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ("Manager",95000, 3);

SELECT * FROM roles LEFT JOIN department ON (roles.department_id = deparment.id);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Peter", "Rabbit", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Austen", 3, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Marcus", "Rojo", 4, 4);

SELECT * FROM employee LEFT JOIN roles ON (employee.role_id = roles.id);
