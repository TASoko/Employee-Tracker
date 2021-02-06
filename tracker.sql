
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (

id INT PRIMARY KEY ,
name varChar (30) not null
);

CREATE TABLE roles (
id  INT PRIMARY KEY, 
title varChar (30) not null,
salary DECIMAL (10, 4) not null,
department_id INT not null 
);

CREATE TABLE employee (
id INT PRIMARY KEY,
first_name varChar (30) not null,
last_name varChar (30) not null,
role_id INT not null,
manager_id INT null
);

INSERT INTO department (id, name) VALUES ("Legal");
INSERT INTO department (id, name) VALUES ("Human Resources");
INSERT INTO department (id, name) VALUES ("Accounting");

SELECT * FROM department;

INSERT INTO roles (id, title, salary, department_id) VALUES ("Partner", 95000, 1);
INSERT INTO roles (id, title, salary, department_id) VALUES ("Head of HR", 90000, 2);
INSERT INTO roles (id, title, salary, department_id) VALUES ("Manager",95000, 3);

SELECT * FROM roles;

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Peter", "Rabbit", 2, 2);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("Jane", "Austen", 3, 3);

SELECT * FROM employee;
