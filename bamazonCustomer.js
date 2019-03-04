var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "root",
    database : "bamazon"
});

connection.connect (function(err) {
    if(err) throw(err);
    displayStock();

});

function displayStock() {
    connection.query("SELECT * FROM products", function(err, results) {
        if(err) throw(err);
        console.log("************ WELCOME TO BAMAZON ************");
        console.log("************* List of Products *************");
        console.log("Code | Product | Price");
        for (var i = 0; i < results.length; i++){
            console.log(results[i].item_id + " | " + results[i].product_name + " | $" + results[i].price);
        }
        askCustomer();
    });
}

function askCustomer() {
    inquirer.prompt([
        {
            name : "itemToBuy",
            type : "input",
            message : "What is the item you would like to buy? (enter the code to the left of the list)"
        },
        {
            name : "quantity",
            type : "input",
            message : "How many do you want?"
        }
    ]).then(function(answer) {
        var itemId = answer.itemToBuy;
        var quantity = parseInt(answer.quantity);
        connection.query("SELECT * FROM products WHERE item_id = ?", itemId, function(err, results) {
            if(err) throw(err);
            var stock = results[0].stock_quantity;
            var price = results[0].price;
            if (quantity > stock) {
                console.log("Insufficient inventory, please check again later");
                askToContinue();
            } else{
                stock = stock - quantity;
                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity : stock}, {item_id : itemId}], function(err){
                    if(err) throw(err);
                    console.log("Total amount to pay: $", price*quantity);
                    askToContinue();
                });
            };            
        });
    });
}

function askToContinue() {
    inquirer.prompt([
        {
            name : "continue",
            type : "confirm",
            message : "Do you wish to keep shopping?",
            default : true
        }
    ]).then(function(answer) {
        if(answer.continue){
            displayStock();
        } else{
            console.log("Thank you for using BAMAZON, your CLI-retail Store!!! Come back soon.");
            connection.end();
        }
    });
}