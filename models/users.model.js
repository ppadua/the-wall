let dbConnection = require("../config/database");
let Encryption = require('md5');

class UsersModel{
    constructor() {}
    /* Function used to register new user */
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

    /* Function used to check user */
    login = async function(user_data){
        let response_data = {status: false, result: {}};

        try{
            let [user] = await dbConnection.executeQuery("SELECT id, username, first_name, last_name FROM users WHERE username = ? AND password = ?", [user_data.username, Encryption(`${user_data.password}thewall`)]);

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
}

module.exports = (function Users(){
    return new UsersModel();
}())