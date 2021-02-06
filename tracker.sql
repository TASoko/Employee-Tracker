
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (

id INT PRIMARY KEY,
name varChar (30) not null
);

CREATE TABLE roles (
id INT PRIMARY KEY, 
title varChar (30) not null,
salary DECIMAL (10, 4) not null,
department_id INT not null 
);

CREATE TABLE employee (
id INT PRIMARY KEY,
first_name varChar (30) not null,
last_name varChar (30) not null,
role_id INT not null,
manager_id INT not null



);