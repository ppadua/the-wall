let UserActionsModel  = require("../models/user_actions.model")

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
                let posts = await UserActionsModel.getPost();
                let user = req.session.user;

                res.render("dashboard", {posts: posts.result, user});
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