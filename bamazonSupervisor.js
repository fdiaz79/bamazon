var mysql = require("mysql");
var inquirer = require("inquirer");
var _ = require("lodash");
var fuzzy = require("fuzzy");

inquirer.registerPrompt('autocomplete', require('./node_modules/inquirer-autocomplete-prompt/index'));

var connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "root",
    database : "bamazon"
});

connection.connect( err => {
    if(err) throw(err);
    console.log("************ WELCOME TO BAMAZON ************");
    console.log("************ Supervisor Application ************");
    supervisorMenu();    
});

function supervisorMenu() {
    inquirer.prompt({
        name : "supervisorAction",
        type : "list",
        message : "What do you want to do? \n",
        choices: ["View sales by department", "Create new department","Exit"]
    }).then( answer => {
        switch (answer.managerAction) {
            case "View sales by department":
                return products("");
            case "Create new department":
                return newDepartment();
            default:
                return goodbye();
        }
    });
}

function goodbye(){
    console.log("\nThank you for using BAMAZON - Supervisor Application. Come back soon.\n");
    connection.end();
};