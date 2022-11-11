let Ejs = require("ejs");
let Path = require("path");

let UserModel = require("../models/users.model")

class UserController{
    constructor(){

    }

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
                let posts = await UserModel.userPosts({
                    user_id: req.session.user.id
                });

                let post_comment_view = await Ejs.renderFile(Path.resolve(__dirname, "../views/partials/post_comment.partials.ejs"), {posts: posts.result, user_id: req.session.user.id}, {async: true})
                res.render("dashboard", {posts: posts.result, post_comment_view, first_name: req.session.user.first_name , last_name: req.session.user.last_name});
            }
            else{
                res.redirect("/");
            }
        }
        catch(error){
            res.send(error)
        }
    }

    register = async function(req, res){
        if(req.body.confirm_password === req.body.password){
            let user_register = await UserModel.register({
                username: req.body.username,
                password: req.body.password,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            });

            if(user_register.status){
                req.session.user = user_register.result;

                req.session.save(function(){
                    res.redirect("/dashboard");
                })
            }
            else{
                let error_message = user_register.message ? user_register.message : "Something went wrong in registering your account";

                res.send(error_message);
            }
        }
        else{
            res.send("Password not match")
        }
    }

    login = async function(req, res){
        let user_register = await UserModel.login({
            username: req.body.username,
            password: req.body.password
        });

        if(user_register.status){
            req.session.user = user_register.result;
            req.session.save(function(){
                res.redirect("/dashboard");
            })
        }
        else{
            res.send("Invalid account");
        }
    }

    logout = function(req,res) {
        req.session.destroy(function(){
            res.redirect("/");
        })
    }
    
    savePostOrComment = async function(req, res){
        if(!req.session.user){
            res.redirect("/")
        }

        let message_data = {
            user_id: req.session.user.id,
            message: req.body.message
        }

        if(req.body.is_comment){
            message_data.post_id = req.body.post_id;
        }

        let user_post = await UserModel.savePostOrComment(message_data, req.body.is_comment);

        if(user_post.status){
            res.redirect("/dashboard")
        }
        else{
            res.send(user_post.error);
        }
    }

    deletePostOrComment = async function(req,res){
        if(!req.session.user){
            res.redirect("/")
        }

        let delete_post_comment = await UserModel.deletePostOrComment({user_id: req.session.user.id,record_id: req.body.record_id}, req.body.is_comment);

        if(delete_post_comment.status){
            res.redirect("/dashboard")
        }
        else{
            res.send(user_post.error);
        }
    }
}

module.exports = (function Users(){
    return new UserController();
}())