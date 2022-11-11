let dbConnection = require("../config/database");

class UsersModel{
    constructor() {
    }
    
    register = async function (user_data){
        let response_data = {status: false, result: false};

        try{
            let [user] = await dbConnection.executeQuery("SELECT id FROM users WHERE username = ?", [user_data.username]);
            
            if(!user){
                let save_user = await dbConnection.executeQuery("INSERT INTO users SET ?, created_at = NOW()", user_data);

                if(save_user.affectedRows){
                    response_data.status = true;
                    response_data.result = {id: save_user.insertId, ...user_data};
                }
            }
            else{
                response_data.message = "Username is already in used!";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;

    }

    login = async function(user_data){
        let response_data = {status: false, result: {}};

        try{
            let [user] = await dbConnection.executeQuery("SELECT id, username, first_name, last_name FROM users WHERE username = ? AND password = ?", [user_data.username, user_data.password]);

            if(user){
                response_data.status = true;
                response_data.result = user;
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    savePostOrComment = async function(post_data, is_comment = false){
        let response_data = {status: false, result: {}};

        try{
            let user_post = await dbConnection.executeQuery(`INSERT INTO ${is_comment ? `comments`: `posts`} SET ?, created_at = NOW()`, post_data);
            
            if(user_post.affectedRows){
                response_data.status = true;
                response_data.result = {id: user_post.insertId, message: post_data.message};
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    deletePostOrComment = async function(post_data, is_comment = false){
        let response_data = {status: false, result: {}};

        try{
            if(!is_comment){
                await dbConnection.executeQuery("DELETE FROM comments WHERE post_id = ?", [post_data.record_id]);
            }

            let delete_post_comment = await dbConnection.executeQuery(`DELETE FROM ${is_comment ? `comments` : `posts`} WHERE id = ? AND user_id = ?`, [post_data.record_id, post_data.user_id])

            if(delete_post_comment.affectedRows){
                response_data.status = true;
            }
            else{
                response_data.message = "Cannot be deleted";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    userPosts = async function(){
        let response_data = {status: false, result:{}};

        try{
            let posts = await dbConnection.executeQuery(`
                SELECT 
                    posts.id AS post_id,
                    posts.message AS message,
                    posts.created_at AS created_at,
                    posts_users.id AS user_id,
                    posts_users.first_name AS first_name,
                    posts_users.last_name AS last_name,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        "comment_id", comments.id,
                        "user_id", comment_users.id,
                        "first_name", comment_users.first_name,
                        "last_name", comment_users.last_name,
                        "message", comments.message,
                        "created_at", comments.created_at
                    )
                ) AS post_comments
                FROM posts 
                LEFT JOIN comments ON comments.post_id = posts.id
                INNER JOIN users AS posts_users ON posts_users.id = posts.user_id 
                LEFT JOIN users AS comment_users ON comment_users.id = comments.user_id
                GROUP BY posts.id
            `)

            response_data.status = true;
            response_data.result = posts;
        }
        catch(error){
            response_data.error;
        }

        return response_data;
    }
}

module.exports = (function Users(){
    return new UsersModel();
}())