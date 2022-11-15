/**
 * This file will contain the logic for product resource
 * Everytime any CRUD request comes for the product, methods defined in this controller
 * file will be excuted 
 */


const {product} = require("../models");
const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;


/**
 * Create and save a new product
 */

exports.create = (req,res)=>{
    /**
     * Validation of the request body
     */

    

    const product = {
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        categoryId: req.body.categoryId
    }

    Product.create(product)
    .then(product => {
        console.log(`product name:[${product.name}] got inserted in db`);
        res.status(200).send(product);
    })
    .catch(err=>{
        console.log(`Issue in inserting product name: [${product.name}].Error Message:${err.message}`);
        res.status(500).send({
            message:"Some internal error while storing the product"
        })
    })


}


/**
 * Get a list of all the products
 */

// 1. products/
// 2. products/nikeshoes

exports.findAll = (req,res) =>{

    let productName = req.query.name;
    let minCost = req.query.minCost; //If nothing is passed then it takes the value "null"
    let maxCost = req.query.maxCost;
    let promise;

    if(productName){
        promise = Product.findAll({
            where:{
                name:productName
            }
        })
    }else if(minCost && maxCost){
        promise = Product.findAll({
            where:{
                cost:{
                    [Op.gte] : minCost,
                    [Op.lte]: maxCost
                }
            }
        })
    }else if(minCost){
        promise =  Product.findAll({
            where:{
                cost:{
                    [Op.gte] : minCost
                }
            }
        })
    }else if(maxCost){
        promise = Product.findAll({
            where:{
                cost:{
                    [Op.lte]:maxCost
                }
            }
        })
    }
    else{
        promise = Product.findAll();
    }

    promise
    .then(products =>{
        res.status(200).send(products);
    })
    .catch(err =>{
        res.status(500).send({
            message:"Some internal error while fetching all the products"
        })
    })


}

/**
 * Get a product based on product id
 */

exports.findOne = (req,res) =>{
    const productId = req.params.id;

    Product.findByPk(productId)
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message:'Product not found'
            })
        }
        res.status(200).send(product);
    })
    .catch(err => {
        res.send(500).send({
            message:"Some internal error while fetching the product based on id"
        })
    })
}



/**
 * To Update the db
 */

exports.update = (req,res) =>{

    if(!req.body.name){
        res.status(400).send({
            message:"Name of the product cannot be empty"
        })
    }

    
    if(!req.body.cost){
        res.status(400).send({
            message:"Cost of the product cannot be empty"
        })
    }

    const product = {
        name:req.body.name,
        description:req.body.description,
        cost:req.body.cost
    }

    const productId = req.params.id;

    Product.update(product,{
        where:{id:productId}
    })
    .then(updatedProduct =>{
        Product.findByPk(productId)
        .then(product =>{
            res.status(200).send(product);
        })
        .catch(err =>{
            res.status(500).send({
                message:"Updation happened successfully, but some internal error in fetching the details"
            })
        })
    })
    .catch(err =>{
        res.status(500).send({
            message:"Some internal error while updating details"
        })
    })

}

/**
 * To delete
 */

exports.delete = (req,res) =>{
    const productId = req.params.id;

    Product.destroy({
        where:{id:productId}
    })
    .then(result =>{
        res.status(200).send({
            message:"Successfully deleted the product"
        })
    })
    .catch(err =>{
        res.status(500).send({
            message:"Some internal error while deleting the product"
        })
    })
}


/** Get the products based on category id */


exports.getProductsUnderCategory = (req,res) =>{
    const categoryId = parseInt(req.params.categoryId);

    Product.findAll({
        where:{
            categoryId: categoryId
        }
    })
    .then(products =>{
        res.status(200).send(products);
    })
    .catch(err => {
        res.status(500).send({
            message:"Some internal error while fetching products based on category id"
        })
    })
}