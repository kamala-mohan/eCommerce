const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;


verifyToken = (req, res, next) => {

    let token = req.headers["x-access-token"] //get access to the token passed by the user

    if(!token){ //if no token passed by user, throw error
        return res.status(403).send({
            message:"No token provided!"
        });
    }

    //Do the verification of the token
    jwt.verify(token, config.secret, (err,decoded) =>{                    //so here we pass the user token, along with the secret salt and a callback fxn
                                                                         //it takes 2 parameters, err which is error and the other one decodes the token and stores in user.id
        if(err){
            return res.status(401).send({
                message:"Unathorised!"
            });
        }

        req.userId = decoded.id;
        next();
    })

}

isAdmin = (req, res, next) => {

    User.findByPk(req.userId)
    .then(user =>{
        user.getRoles()
        .then(roles => {
            for(let i =0;i<roles.length;i++){
                if(roles[i].name === "admin"){
                    next();
                    return;
                }
            }

            res.status(403).send({
                message:"Required Admin Role"
            });
            return;
        });
    });

};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
};

module.exports = authJwt;