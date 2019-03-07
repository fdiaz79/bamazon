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

connection.connect (function(err) {
    if(err) throw(err);
    displayStock();

});
var productIdArr = [];
function displayStock() {
    connection.query("SELECT item_id, product_name, price  FROM products", function(err, results) {
        if(err) throw(err);
        for (var i = 0; i < results.length; i++){
            productIdArr.push(results[i].item_id);            
        }
        console.log("\n************ WELCOME TO "+ colors.rainbow("BAMAZON")+" ************");
        console.log("\n************* List of Products *************\n");
        var table = cTable.getTable(results);
        console.log(table);
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
        var itemId = parseInt(answer.itemToBuy);
        var quantity = parseInt(answer.quantity);
        var toPay;
        var idNotFound = true;
        for (var i = 0; i < productIdArr.length; i++){
            if (productIdArr[i] == itemId){
                idNotFound = false;
            }
        }
        if(isNaN(itemId) || idNotFound) {
            console.log(colors.red.underline.bold("\nUnknown Item. Please select one code from the list.\n"));
            return displayStock();
        };
        if(isNaN(quantity)){
            console.log(colors.red.underline.bold("\nPlease enter a numeric value for the quantity"));
            return displayStock();
        };
        connection.query("SELECT * FROM products WHERE item_id = ?", itemId, function(err, results) {
            if(err) throw(err);            
            var stock = results[0].stock_quantity;
            var price = results[0].price;
            var productSales = results[0].product_sales;
            if (quantity > stock) {
                console.log(colors.red.underline.bold("\nInsufficient inventory, please check again later\n"));
                askToContinue();
            } else{
                stock = stock - quantity;
                var toPayNoRound = price * quantity;
                toPay = Math.ceil(toPayNoRound*100)/100;
                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity : stock, product_sales : productSales + toPay}, {item_id : itemId}], function(err){
                    if(err) throw(err);
                    console.log(colors.green("\nTotal amount to pay: $"+ toPay + "\n"));
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
            console.log("\nThank you for using "+ colors.rainbow("BAMAZON")+", your CLI-retail Store!!! Come back soon.\n");
            connection.end();
        }
    });
}