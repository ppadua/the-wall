let Ejs        = require("ejs");
let Path       = require("path");
let Encryption = require('md5');
let UserActionModel  = require("../models/user_actions.model")
let GlobalHelper = require("../helpers/index");

class UserActionController{
    constructor(){ }

    create_post = async function(req, res){
        let response_data = {status: false, result:{}};

        try{
            let check_fields = GlobalHelper.checkFields(["message"], ["post_id"], req.body);

            if(check_fields.status){
                let message_data = {
                    user_id: req.session.user.id,
                    message: check_fields.result.message
                }
                if(check_fields.result.post_id){
                    message_data.post_id = check_fields.result.post_id
                }

                let user_register = await UserActionModel.create_post(message_data, !check_fields.result.post_id);

                if(user_register.status){
                    response_data.status = true;
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

    delete_post = async function(req, res){
        let response_data = {status: false, result:{}};

        try{
            let check_fields = GlobalHelper.checkFields(["record_id"], ["post_id"], req.body);

            if(check_fields.status){
                let user_register = await UserActionModel.delete_post(check_fields.result.record_id, check_fields.result.post_id);

                if(user_register.status){
                    response_data.status = true;
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
}

module.exports = (function Users(){
    return new UserActionController();
}())