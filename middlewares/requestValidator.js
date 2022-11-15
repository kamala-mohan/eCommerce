const db = require("../models");
const Category = db.category;

const validateCategoryRequest = (req,res,next) =>
{
    if(!req.body.name){
        res.status(400).send({
            message:"Name of the category can't be empty !"
        })
    }
    next();
}


const validateProductRequest = (req,res,next) =>{
    if(!req.body.name){
        res.status(400).send({
            message:"Name of the product can't be empty !"
        })
        return;
    }

    if(!req.body.cost){
        res.status(400).send({
            message:"Cost of the product can't be empty !"
        })
        return;
    }

    if(req.body.categoryId){

        Category.findByPk(req.body.categoryId)
        .then(category =>{
            if(!category){
                res.status(400).send({
                    message: "Category id passed is not available"
                })
                return;
            }
            next(); //->right response->controller
        })
        .catch(err =>{
            res.status(500).send({
                message:"Some internal error while fetching the product details"
            })
        })
    }else{
        res.status(400).send({
            message:"Category id was not passed"
        })
        return;
    }

}

//This is for the above code.
/**- CategoryId was passed
-Check if it is a valid categoryId.
-It is not a valid category Id
Some error occured while fetching the details of
categoryId
- CategoryId was not_passed
*/
module.exports = {
    validateCategoryRequest:validateCategoryRequest,
    validateProductRequest:validateProductRequest
}