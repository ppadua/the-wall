let Ejs        = require("ejs");
let Path       = require("path");
let Encryption = require('md5');
let UserModel  = require("../models/users.model")
let GlobalHelper  = require("../helpers/index");

class UserController{
    constructor(){ }

    homepage = function(req, res){
        if(req.session.user !== undefined){
            res.redirect("/dashboard");
        }
        else{
            res.render("homepage");
        }
    }

    dashboard = async function(req,res){
        try{
            if(req.session.user !== undefined){
                res.render("dashboard");
            }
            else{
                res.redirect("/");
            }
        }
        catch(error){
            res.send(error)
        }
    }
}

module.exports = (function Users(){
    return new UserController();
}())