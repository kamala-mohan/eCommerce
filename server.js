const express = require('express');  
const serverConfig = require('./configs/server.config');
const bodyParser = require('body-parser');


//initialising express
const app = express();


/**
 * Using the body parser middleware
 * 
 * Used for parsing the request
 * Parsing the request of the type json and convert that to object
 */


//In the below 2 lines we are parsing the request to json format
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


/**
 * Initialising the database
 
 */


const db = require("./models");     //It automatically chooses index.js
const Category = db.category;
const Product = db.product;
const Role = db.role;

Category.hasMany(Product); //This will create a foreign key col (categoryId) in the product table



/**
 * So everytime the server is restarted, all the existing table is dropped
 * And the dummy values are pushed in
 */
db.sequelize.sync({force:true})
.then(()=>{
    console.log('tables dropped and created');
    init();
})

function init(){
    var categories = [
    {
        name:"Electronics",
        description:"This category will contain all the electronic products"

    },
    {
        name:"KitchenItems",
        description:"This category will contain all the kitchen products"

    }];

    Category.bulkCreate(categories)
    .then(()=>{
        console.log("Category table initialised");
    })
    .catch(err=>{
        console.log("Error while initialising categories table");
    })


    /**
     * Adding roles
     */
    Role.create({
        id:1,
        name:"user"
    });
    Role.create({
        id:2,
        name:"admin"
    })

}

/**
 * The below line, we are calling the app fxn in the routes section
 */
require('./routes/category.routes')(app)  
require('./routes/product.routes')(app)    
require('./routes/auth.routes')(app)    
require('./routes/cart.routes')(app)   

app.listen(serverConfig.PORT,() => {
    console.log(`Application started on the port no: ${serverConfig.PORT}`)
})