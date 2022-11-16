/** 
This file will be used for the following purpose
1.Create the DB connection with the help of sequelize.
2.Export all the functionalities of the model through the file.

One of the biggest advantages of using index.js file is other file
trying to import this file just need to provide the module name
**/

const config = require("../configs/db.config");
const Sequelize = require("sequelize");

/**
 * Creating the db connection
 */


const seq = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host:config.HOST,
        dialect:config.dialect
    }
);


const db = {}
db.Sequelize = Sequelize;
db.sequelize = seq;
db.category = require('./category.model.js')(db.sequelize,Sequelize);
db.product = require('./product.model.js')(db.sequelize,Sequelize);
db.user = require('./user.model.js')(db.sequelize,Sequelize);
db.role = require('./role.model.js')(db.sequelize,Sequelize);

/**
 * establish the relationship bw the Role and the User
 *  In the below code we are establishing a many to many 
 * relationship bw the "role" and the "user" table
 */

db.role.belongsToMany(db.user,{
    through: "user_roles",                 //through-> is the table that creates a relationship bw two tables
    foreignKey:"roleId",
})

db.user.belongsToMany(db.role,{
    through:"user_roles",
    foreignKey:"userId"

})

db.ROLES = ["user","admin"]

//Here db is the object and all the key and val pair is pushed inside the obj
module.exports = db;

