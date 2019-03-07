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
var productCount = 0;
function displayStock() {
    connection.query("SELECT * FROM products", function(err, results) {
        if(err) throw(err);
        productCount = results.length;
        console.log("\n************ WELCOME TO BAMAZON ************");
        console.log("************* List of Products *************\n");
        console.log("Code | Product | Price");
        for (var i = 0; i < productCount; i++){
            console.log(results[i].item_id + " | " + results[i].product_name + " | $" + results[i].price);
        }
        console.log("");
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
        var toPay;
        if(isNaN(itemId) || itemId < 1 || itemId > productCount) {
            console.log("\nItem desconocido. Please select one code from the list.\n");
            return displayStock();
        };
        if(isNaN(quantity)){
            console.log("\nPlease enter a numeric value for the quantity");
            return displayStock();
        };
        connection.query("SELECT * FROM products WHERE item_id = ?", itemId, function(err, results) {
            if(err) throw(err);            
            var stock = results[0].stock_quantity;
            var price = results[0].price;
            var productSales = results[0].product_sales;
            if (quantity > stock) {
                console.log("\nInsufficient inventory, please check again later\n");
                askToContinue();
            } else{
                stock = stock - quantity;
                toPay = price * quantity;
                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity : stock, product_sales : productSales + toPay}, {item_id : itemId}], function(err){
                    if(err) throw(err);
                    console.log("\nTotal amount to pay: $"+ toPay + "\n");
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
            console.log("\nThank you for using BAMAZON, your CLI-retail Store!!! Come back soon.\n");
            connection.end();
        }
    });
}