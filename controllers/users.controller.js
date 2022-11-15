let Ejs        = require("ejs");
let Path       = require("path");
let Encryption = require('md5');
let UserModel  = require("../models/users.model")
let GlobalHelper = require("../helpers/index");

class UserController{
    constructor(){ }

    register = async function(req, res){
        let response_data = {status: false, result:{}};

        try{
            let check_fields = GlobalHelper.checkFields(["username", "password", "confirm_password", "first_name", "last_name"], [], req.body);

            if(check_fields.status){
                if(req.body.confirm_password === req.body.password){
                    let user_register = await UserModel.register({
                        username: req.body.username,
                        password: Encryption(`${req.body.password}thewall`),
                        first_name: req.body.first_name,
                        last_name: req.body.last_name
                    });

                    if(user_register.status){
                        req.session.user = user_register.result;
                        req.session.save();

                        response_data = user_register;
                    }
                    else{
                        response_data.error = "Something went wrong";
                    }
                }
                else{
                    response_data.error = "Something went wrong";
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);    
    }

    login = async function(req, res){
        let response_data = {status: false, result:{}};

        try{
            let check_fields = GlobalHelper.checkFields(["username", "password"], [], req.body);
    
            if(check_fields.status){
                let user_register = await UserModel.login({
                    username: req.body.username,
                    password: req.body.password
                });
    
                if(user_register.status){
                    req.session.user = user_register.result;
                    req.session.save();
                    response_data = user_register;
                }
                else{
                    response_data = user_register;
                }   
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);    
    }

    logout = function(req,res) {
        req.session.destroy(function(){
            res.redirect("/");
        })
    }
}

module.exports = (function Users(){
    return new UserController();
}())