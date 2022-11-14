/**
 * This file contains the controller logic for the category resource
 * Everytime a CRUD request come for the category, mthods defined 
 * in this controller file will be excueted
 */

const db = require("../models");  //This take us to the db in the index.js page
const Category = db.category;  //then inside the db obj, we pick the category


/**
 * POST: Create and save a new category
*/

//Checking for the vaid request
exports.create = (req,res) =>{
    
    
    
    
    /**
     * Creation of the category object to be stored in the db
     */
    
    const category = {
        name:req.body.name,
        description:req.body.description
    };
    
    Category.create(category)
    .then(category=>{
        console.log(`catgory name:[$category.name] got inserted in the DB`)
        res.status(201).send(category);
    })
    .catch(err=>{
        console.log(`Issue in inserting category name: [${category.name}]`)
        console.log(`Error Message:${err.message}`)
        res.status(500).send({
            message:"Some internal error while storing the category"
        })
    })
}


/**
 * Get a list of all the categories
 */

//We are going to implement these two ways of getting the data
// ecom/v1/categories
// ecom/v1/categories/kitchen

// ecom/v1/categories/name=kitchen -> name param
// ecom/v1/categories/1 -> path param


exports.findAll = (req,res)=>{
    let categoryName = req.query.name;
    let promise;
    if(categoryName){
        promise = Category.findAll({
            where:{
                name: categoryName
            }
        });
    }else{
        promise = Category.findAll();
    }

    promise
    .then(categories=>{
        res.status(200).send(categories);
    })
    .catch(err =>{
        res.status(500).send({
            message:"Some internal error while fetching the categories"
        })
    })
}

/**
 * Get the category based on the category id
 */

exports.findOne = (req,res)=>{
    const categoryId = req.params.id;  //1

    Category.findByPk(categoryId)
    .then(category=>{
        if(!category){
            return res.status(404).json({
                message:'Category not found'
            })
        }
        res.status(200).send(category);
    })
    .catch(err =>{
        res.status(500).send({
            message:"Some internal error while fetching the category based on id"
        })
    })
}

/**
 * Update the existing category
 */

exports.update = (req,res)=>{

    //This is the updated name and description below
    const category = {
        name:req.body.name,
        description:req.body.description
    };

    const categoryId = req.params.id

    Category.update(category,{
        where :{id:categoryId}
    })
    .then(updatedCategory =>{
        /**
         * Where the updation happened successfully
         * You need to send the updated row to the table
         * But while fetching that row and sending it to user
         * there can bean error
         */
        Category.findByPk(categoryId)
        .then(category=>{
            res.status(200).send(category);
        })
        .catch(err=>{
            res.status(500).send({
                message:"Some internal error while fetching the category based pn id"
            })
        })

    })
    .catch(err=>{
        //Where the updation task failed
        res.send(500).send({
            message:"Some internal error while updating the category based on id"
        })
    })
}


/**
 * Delete an existing category based on category id
 */

exports.delete = (req,res) =>{
    const categoryId = req.params.id;

    Category.destroy({
        where:{
            id:categoryId
        }
    })
    .then(result =>{
        res.status(200).send({
            message:"Successfully deleted the category"
        })
    })
    .catch(err =>{
        res.status(500).send({
            message:"Some  internal error while deleting the category based on id"
        })
    })
}

