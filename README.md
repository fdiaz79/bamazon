# BAMAZON - your CLI retail store

This app has 3 main applications:

* Customer Application, accesible with command _node bamazonCustomer.js_ :

![Customer App](/images/customerApp.PNG)

* Manager Application accesible with command _node bamazonManager.js_ :

![Manager App](/images/managerApp.PNG)


* Supervisor Application accesible with command _node bamazonSupervisor.js_ :

![Supervisor App](/images/supervisorApp.PNG)


## CUSTOMER APPLICATION:

This app is designed for the customer who wants to buy something; after starting up the app, a list with the products is displayed. The customer will be asked to enter the code on the left of the product he wants from the list and then the quantity he wants.
If the input is correct and there is enough stock, the customer will be shown a message indicating the total amount to pay and then the option of continue shopping or exiting.

If the input is incorrect (non existent product code or non numeric quantity), the user will be shown the corresponfing message and then will be prompted again for the item to buy.

[Customer App Video] https://drive.google.com/file/d/1MgyMBh2p4nWsTJyaXYyYMMuEyjIZZpP-/view

## MANAGER APPLICATION:

This app is designed for the manager of the store to modify the inventory; he can view the full inventory of the store, view low stock inventory, add more inventory of an specific item or even add a new product that doesn't exist in the store. 
To add inventory of a specific product, the manager starts typing and a list will be generated with possible matches, based on the current products. When creating a new product, a list with all the existing departments will be generated in order to add the new product to an existing department. To see this functionality in full, please follow this link:

[Manager App Video] https://drive.google.com/file/d/1hdOj1LpQUvLOY7jAZRs4LZFYOu0g3-om/view

## SUPERVISOR VIDEO

This app will allow the Supervisor of the store to add new departments and to check sales by department (alphabetically organized) and the profit (or losses) of each department, based on a standar overhead cost of $500.00. To see this App working, please refer to the following video:

[Supervisor App Video] https://drive.google.com/file/d/1HFC5xwqlnx6xj8vlhYwu2x5HKF66EoCy/view


## TECHNICAL STUFF

This online store is based on a SQL Database with two tables called products and departments. They are related via the column department_name. This allows to calculate the total sales by department, by adding the total sales of each product after grouping them by department. Then the overhead cost of each department is substracted from the department sales on the fly and the result is inserted into the object that is displayed in the console. 

To works properly, **BAMAZON Store** requires the following node modules:
* **mysql**, to create the connections and queries to the database
* **inquirer**, to generate the prompts to interact with the user
* **console.table** to generate more esthetic tables and have a better user experience
* **colors** to give some color to the text, depending on the message that is dsiplayed to the user
* **inquirer-autocomplete-prompt, fuzzy and lodash** these three modules interatc to generate lists of possible inputs for the user.

Just run npm install in the folder your app will be residing, to install all the dependencies needed.








