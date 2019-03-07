DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10,2),
    stock_quantity INTEGER(6),
    product_sales DECIMAL(20,2) DEFAULT 0,
    PRIMARY KEY(item_id)
);

CREATE TABLE departments(
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL (10,2) DEFAULT 500,
    PRIMARY KEY(department_id)
);

