var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
var colors=require("colors/safe");

var connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "root",
    database : "bamazon"
});

connection.connect( err => {
    if(err) throw(err);
    console.log("\n************ WELCOME TO "+ colors.rainbow("BAMAZON")+" ************");
    
    supervisorMenu();    
});

function supervisorMenu() {
    console.log("\n********** Supervisor Application **********\n");
    inquirer.prompt({
        name : "supervisorAction",
        type : "list",
        message : "What do you want to do? \n",
        choices: ["View sales by department", "Create new department","Exit"]
    }).then( answer => {
        switch (answer.supervisorAction) {
            case "View sales by department":
                return salesByDepartment();
            case "Create new department":
                return newDepartment();
            default:
                return goodbye();
        }
    });
}

function newDepartment(){    
    inquirer.prompt([
        {
            name : "departmentToCreate",
            type : "input",
            message : "name of the department you want to create?",
        }
    ]).then( answer => {
        var name = answer.departmentToCreate;
        connection.query("INSERT INTO departments SET ?",{department_name : name}, (err, results) => {
            if(err) throw(err);
            console.log(colors.green("\n"+results.affectedRows + " department added.\n"));
            supervisorMenu();
        })
    });
};

function salesByDepartment() {
    console.log(colors.bgGreen("\n********** Total Sales by Department **********\n"))
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs,"+
    "SUM(products.product_sales) AS department_sales FROM departments LEFT JOIN products"+
    " ON departments.department_name=products.department_name GROUP BY department_name", (err, results) => {
        if(err) throw(err);
        for (var i = 0; i < results.length; i++){
            if (results[i].department_sales == null ){
                results[i].department_sales = 0;
            }
            results[i].total_profit = results[i].department_sales - results[i].over_head_costs;
        }
        var table = cTable.getTable(results);
        console.log(table);
        supervisorMenu();
    })
}


function goodbye(){
    console.log("\nThank you for using "+ colors.rainbow("BAMAZON")+" - Supervisor Application. Come back soon.\n");
    connection.end();
};