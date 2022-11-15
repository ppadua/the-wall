let dbConnection = require("../config/database");
let Encryption = require('md5');

class UserActionsModel{
    constructor() {}

    getPost = async function (user_data){
        let response_data = {status: false, result: false};

        try{
            let posts = await dbConnection.executeQuery(`
                SELECT posts.id AS post_id, posts.user_id, CONCAT(users.first_name, " ", users.last_name) AS full_name, posts.message, posts.created_at,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            "comment_id", comments.id,
                            "user_id", users.id,
                            "full_name", CONCAT(users.first_name, " ", users.last_name),
                            "message", comments.message,
                            "created_at", comments.created_at
                        )
                    )
                    FROM comments
                    INNER JOIN users ON users.id = comments.user_id
                    WHERE comments.post_id = posts.id
                ) AS comments
                FROM posts 
                INNER JOIN users ON users.id = posts.user_id`);

            response_data.status = true;
            response_data.result = posts;
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    create_post = async function (post_data, is_post = false){
        let response_data = {status: false, result: false};

        try{
            let posts = await dbConnection.executeQuery(`INSERT INTO ${is_post ? `posts` : `comments`} SET ?, created_at = NOW()`, post_data);

            if(posts.affectedRows){
                response_data.status = true;
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    delete_post = async function (record_id, is_post = false){
        let response_data = {status: false, result: false};

        try{
            let posts = await dbConnection.executeQuery(`DELETE FROM ${!is_post ? `posts` : `comments`} WHERE id = ?`, record_id);

            if(posts.affectedRows){
                response_data.status = true;
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = (function Users(){
    return new UserActionsModel();
}())