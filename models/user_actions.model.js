let dbConnection = require("../config/database");

class UserActionsModel{
    constructor() {}

    postMessage = async function(message_data, post_id){
        let response_data = {status: false, result: {}};

        try{
            let create_message = await dbConnection.executeQuery(`INSERT INTO ${!post_id ? 'posts' : 'comments' } SET ?, created_at = NOW()`, message_data);

            if(create_message.affectedRows){
                response_data.status = true;
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    deleteMessage = async function(post_data, is_post = false){
        let response_data = {status: false, result: {}};

        try{
            let delete_message = await dbConnection.executeQuery(`DELETE FROM ${is_post ? 'posts' : 'comments' } WHERE id = ?`, post_data.record_id);

            if(is_post){
                await dbConnection.executeQuery(`DELETE FROM comments WHERE post_id = ?`, post_data.record_id)
            }

            if(delete_message.affectedRows){
                response_data.status = true;
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    /* Get all messages */
    getMessages = async function(){
        let response_data = {status: false, result: {}};
        
        try{
            let messages = await dbConnection.executeQuery(`
                SELECT 
                    posts.id AS post_id,
                    posts.message AS message,
                    posts.created_at AS created_at,
                    post_users.id AS user_id,
                    CONCAT(post_users.first_name, " ", post_users.last_name) AS post_full_name,
                    IF(TIMESTAMPDIFF(MINUTE, NOW(),posts.created_at) > 30, 0, 1) AS is_delete,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            "comment_id", comments.id,
                            "user_id", comment_users.id,
                            "comment_full_name", CONCAT(comment_users.first_name, " ", comment_users.last_name),
                            "message", comments.message,
                            "created_at", comments.created_at,
                            "is_delete", IF(TIMESTAMPDIFF(MINUTE, NOW(),comments.created_at) > 30, 0, 1)
                        )
                    )  AS post_comments
                FROM posts
                LEFT JOIN comments oN comments.post_id = posts.id
                LEFT JOIN users AS comment_users ON comment_users.id = comments.user_id
                INNER JOIN users AS post_users ON post_users.id = posts.user_id
                GROUP BY posts.id;
            `);

            response_data.status = true;
            response_data.result = messages;
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