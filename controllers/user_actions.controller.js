let GlobalHelper  = require("../helpers/index");
let UserActionsModel = require("../models/user_actions.model"); 

class UserActionsController {
    constructor(){}

    post = async function(req, res){
        try{
            let check_field = GlobalHelper.checkFields(["post"], ["post_id"], req.body);

            if(check_field.status){
                if(req.session.user){
                    let post_details = { user_id: req.session.user.id, message: check_field.result.post };

                    if(check_field.result.post_id){
                        post_details.post_id = check_field.result.post_id;
                    }
                    
                    let post = await UserActionsModel.postMessage(post_details, check_field.result.post_id ? true: false);

                    if(post.status){
                        res.redirect("/dashboard");
                    }
                    else{
                        GlobalHelper.alertMessage(res, `Someting went wrong on creating message!`, "/dashboard");
                    }
                }
                else{
                    GlobalHelper.alertMessage(res, `No session found!`, "/");
                }
            }
            else{
                GlobalHelper.alertMessage(res, `Missing data, ${check_fields.result.missing_fields.join(",")}`, "/dashboard");
            }
        } 
        catch(error){
            GlobalHelper.alertMessage(res, `Something went wrong on posting message!`, "/dashboard");
        }
    }

    deletePost = async function(req, res){
        try{
            let check_field = GlobalHelper.checkFields([], ["post_id", "comment_id"], req.body);

            if(check_field.status){
                if(req.session.user){
                    let post_details = { user_id: req.session.user.id};
                    post_details.record_id = check_field.result.post_id  ? check_field.result.post_id : check_field.result.comment_id;
                    
                    let post = await UserActionsModel.deleteMessage(post_details, check_field.result.post_id ? true: false);

                    if(post.status){
                        res.redirect("/dashboard");
                    }
                    else{
                        GlobalHelper.alertMessage(res, `Someting went wrong on creating message!`, "/dashboard");
                    }
                }
                else{
                    GlobalHelper.alertMessage(res, `No session found!`, "/");
                }
            }
            else{
                GlobalHelper.alertMessage(res, `Missing data, ${check_fields.result.missing_fields.join(",")}`, "/dashboard");
            }
        } 
        catch(error){
            GlobalHelper.alertMessage(res, `Something went wrong on posting message!`, "/dashboard");
        }
    }
}

module.exports = (function Users(){
    return new UserActionsController();
}())