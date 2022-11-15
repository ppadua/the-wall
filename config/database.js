let mysql = require("mysql");

class DatabaseConfiguraiton{
    constructor(){
        this.DatabaseConnection = this.createPoolConnection();
    }

    createPoolConnection = function(){
        return mysql.createPool(Object.assign({connection_limit: 1000},{
            host: "localhost",
            user: "new_root",
            password: "new_root",
            database: "wall",
            port: "3306",
        }))
    }

    executeQuery = function(query, query_data){
        return new Promise(async (resolve, reject) => {
            await this.DatabaseConnection.query(query, query_data, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            })
        })
    }
}

module.exports = (function Users(){
    return new DatabaseConfiguraiton()
}())