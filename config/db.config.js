// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//                || Path: config/db.config.js                      //
//                                                                  //
// ====================== || Author data || ======================= //
//                                                                  //
//          Code author - Pasha Marchenko.                          //
//          Email - programmingmarchenko@gmail.com                  //
//          GitHub - https://github.com/PmarchenkoUCode.            //
//                                                                  //
// ================================================================ //

const mysql = require('mysql2'); // import mysql
require('dotenv').config(); // import dotenv

// Class connection create pool connection to database and execute query to database.
class connection {
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit : 10,
            host        : process.env.DB_HOST || 'localhost',
            port        : process.env.DB_PORT || 3306,
            user        : process.env.DB_USER || 'pmarchenko',
            password    : process.env.DB_PASSWORD || '40tefavi',
            database    : process.env.DB_DATABASE || 'usof'
        });
    }

    // Query execute to database execute.
    // execute method return promise.
    executeQuery(query, params) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(query, params, (err, results) => {
                        connection.release();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                }
            });
        });
    }
}

module.exports = new connection();