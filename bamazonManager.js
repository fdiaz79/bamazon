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

var productArray = [];
var departmentArray = [];

connection.connect( err => {
    if(err) throw(err);
    console.log("************ WELCOME TO BAMAZON ************");
    console.log("************ Manager Application ************");
    mainManagerMenu();    
});

function mainManagerMenu (){
    inquirer.prompt({
        name : "managerAction",
        type : "list",
        message : "What do you want to do? \n",
        choices: ["View products for sale", "View low inventory", "Add to inventory", "Create new product","Exit"]
    }).then( answer => {
        switch (answer.managerAction) {
            case "View products for sale":
                return products("");
            case "View low inventory":
                return products(" WHERE stock_quantity < 5");
            case "Add to inventory":
                return addInventory();
            case "Create new product":
                return newProduct();
            default:
                return goodbye();
        }
    });
}

function products(condition){
    connection.query("SELECT * FROM products"+condition, (err, results) => {
        if(err) throw(err);
        console.log("\n************* List of Products ************* \n");
        console.log("Code | Product | Price | Available stock");
        for (var i = 0; i < results.length; i++){
            console.log(results[i].item_id + " | " + results[i].product_name + " | $" + results[i].price + " | " + results[i].stock_quantity);
        }
        console.log("\n*************************\n");
        mainManagerMenu();
    });
};

function loadProducts() {
    productArray = [];
    connection.query("SELECT * FROM products", (err, results) => {
        if(err) throw(err);
        for (var i = 0; i < results.length; i++) {
            productArray.push(results[i].product_name);
        }
    });
   
}
function loadDepartments() {
    departmentArray = [];
    connection.query("SELECT * FROM departments", (err, response) => {
        if(err) throw(err);
        for (var k = 0; k < response.length; k++) {
            departmentArray.push(response[k].department_name);
        }
    });
}


function addInventory(){
    loadProducts();
    function searchProduct(answers , input){
        input = input || "";
        return new Promise(function (resolve) {
            setTimeout(function() {
                var fuzzyResult = fuzzy.filter(input, productArray);
                resolve(
                    fuzzyResult.map(function (el) {
                        return el.original;
                    })
                );
            }, _.random(30,500));
        });
    }
    inquirer.prompt([
        {
            name : "itemToAdd",
            type : "autocomplete",
            message : "What item do you want to add stock?",
            source : searchProduct,
            validate : function(val) {
                return val ? true : "Please start typing."
            }
        },
        {
            name : "qtyToAdd",
            type : "input",
            message : "Please enter quantity to add:",
            validate : function (val) {
                if (isNaN(val)){ 
                    return ("Input not accepted. Please enter a number");
                } else{
                    return true;
                }
            }
        }
    ]).then( answer => {
       connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?", [answer.qtyToAdd, answer.itemToAdd], (err, results) => {
            if(err) throw(err);
            console.log("\n"+results.affectedRows + " product quantity added.\n");
            mainManagerMenu();
        })
    });
};

function newProduct(){    
    loadDepartments();
    loadProducts();
    function searchDepartment(answers , input){

        input = input || "";
        return new Promise(function (resolve) {
            setTimeout(function() {
                var fuzzyResult = fuzzy.filter(input, departmentArray);
                resolve(
                    fuzzyResult.map(function (el) {
                        return el.original;
                    })
                );
            }, _.random(30,500));
        });
    };
    inquirer.prompt([
        {
            name : "itemToCreate",
            type : "input",
            message : "What product do you want to create?",
        },
        {
            name : "quantityToCreate",
            type : "input",
            message : "How many do you want to add to the inventory?",
            validate : function (val) {
                if (isNaN(val)){ 
                    return ("Input not accepted. Please enter a number");
                } else{
                    return true;
                }
            }
        },
        {
            name : "itemPrice",
            type : "input",
            message : "Please enter the price of the new product: $",
            validate : function (val) {
                if (isNaN(val)){ 
                    return ("Input not accepted. Please enter a number");
                } else{
                    return true;
                }
            }
        },
        {
            name : "itemDepartment",
            type : "autocomplete",
            message : "What department will this product be located?",
            source : searchDepartment,
            validate : function(val) {
                return val ? true : "Please start typing."
            }
        }
    ]).then( answer => {
        var name = answer.itemToCreate;
        var department = answer.itemDepartment;
        var price = answer.itemPrice;
        var quantity = answer.quantityToCreate;
        connection.query("INSERT INTO products SET ?",
        {
            product_name : name,
            department_name : department,
            price : price,
            stock_quantity : quantity
        }, (err, results) => {
            if(err) throw(err);
            console.log("\n"+results.affectedRows + " product quantity added.\n");
            mainManagerMenu();
        })
        console.log("Add New Product");
    });
};

function goodbye(){
    console.log("\nThank you for using BAMAZON - Manager Application. Come back soon.\n");
    connection.end();
};

