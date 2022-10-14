//The first thing that gets loaded is the "process.env", in that we have 
//an env called the "NODE_ENV", so thats not equal to the production
//which means its in the dev envrionment, so then we call the "dotenv" module.

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

//This can be exported and used by other files 
module.exports = {
    PORT:process.env.PORT
}
