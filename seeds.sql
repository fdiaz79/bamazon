USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES("Sofa", "Furniture", 220, 30), ("TV Table", "Furniture", 120, 20), ('50" LED TV', "Electronics", 350, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES("Surround Sound System", "Electronics", 50, 12), ("Microwave Oven", "Appliances", 70, 40), ("Male Sweater", "Clothing", 20, 110);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES("Dinning Table", "Furniture", 180, 8), ("Jogging pants", "Clothing", 15, 200), ('Refrigerator', "Appliances", 400, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES("Football", "Sports", 10, 50), ("Tennis Racquet", "Sports", 30, 30), ('Basket Hoop', "Sports", 90, 20);

INSERT INTO departments (department_name) VALUES("Furniture"), ("Electronics"), ("Appliances"), ("Sports"), ("Clothing");