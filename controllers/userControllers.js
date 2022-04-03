// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//             || Path: routes/userControllers.js                   //
//                                                                  //
//                 Router for the users routes                      //
//(getAll, getOne, createUser, updatePhoto, updateUserInfo, delete).//
//                                                                  //
// ====================== || Author data || ======================= //
//                                                                  //
//          Code author - Pavlo Marchenko.                          //
//          Email - programmingmarchenko@gmail.com                  //
//          GitHub - https://github.com/PmarchenkoUCode.            //
//                                                                  //
// ================================================================ //

const bcrypt = require('bcrypt'); // for hashing passwords
const db = require('../config/db.config'); // for database
const jwt = require('jsonwebtoken'); // for generating and verifying tokens
const check = require('../middleware/checkingUserInfo'); // for checking the user info
const validation = require('../middleware/validatorUserInfo'); // for checking the user info
const dotenv = require('dotenv'); // for loading environment variables
dotenv.config(); // load environment variables

class users {
    // get all users
    async getAll(req, res) {
        const query = `SELECT accounts.login, accounts.full_name, accounts.photo, accounts.email FROM accounts;`;
        const result = await db.executeQuery(query);
        if (result.length > 0) {
            res.status(200).json({
                message: 'Users successfully fetched.',
                result: result
            });
        } else {
            res.status(500).json({
                message: 'Users fetch failed.'
            });
        }
    }

    // get one user params [user_id].
    // Data output without password data.
    async getOne(req, res) {
        const { user_id } = req.params;
        const query = `SELECT accounts.login, accounts.full_name, accounts.photo, accounts.email FROM accounts WHERE id = ?;`;
        const params = [user_id];
        const result = await db.executeQuery(query, params);
        if (result.length > 0) {
            res.status(200).json({
                message: 'User successfully fetched.',
                result: result
            });
        } else {
            res.status(500).json({
                message: 'User fetch failed.'
            });
        }
    }

        
    // The function is available only to Admin users.
    // checkAdmin [token]
    // Create a new user.
    async create(req, res) {
        // Checking if this is an admin token
        const { user } = req.session;
        const decoded = await jwt.verify(user.token, process.env.SECRET);
        if (decoded.role === 'User') {
            return res.status(401).json({
                message: 'You are not authorized to perform this action.'
            });
        }

        const { login, password, full_name, email, role } = req.body;
        const validLogin = await validation.login(login);
        const validPassword = await validation.password(password);
        const validFullName = await validation.full_name(full_name);
        const validEmail = await validation.email(email);
        const validRole = await validation.role(role);
        const checkLogin = await check.checkLogin(validLogin);
        const checkEmail = await check.checkEmail(validEmail);
        const hash = await bcrypt.hash(validPassword, 10);
        const query = `INSERT INTO accounts (login, password, full_name, email, role) VALUES (?, ?, ?, ?, ?);`;
        const params = [checkLogin, hash, validFullName, checkEmail, validRole];
        const result = await db.executeQuery(query, params);
        if (result.affectedRows === 1) {
            res.status(200).json({
                message: 'User successfully created.',
                result: result
            });
        }
        else {
            res.status(500).json({
                message: 'User creation failed.'
            });
        }
    }

    // Update user photo accounts user_id[token].
    // Update avatars [name, path, size, type, author_id] in the database.
    async updatePhoto(req, res) {
        const { user } = req.session;
        const decoded = await jwt.verify(user.token, process.env.SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: 'You are not authorized to perform this action.'
            });
        }

        const name = req.files.photo.name.split('.');
        // File upload time.
        const time = new Date().getTime();
        const newName = `${name[0]}_${time}.${name[1]}`;
        const newPath = `public/avatar/${newName}`;
        const newSize = req.files.photo.size;
        const newType = req.files.photo.mimetype;
        const newAuthor = decoded.id;
        const query = `INSERT INTO avatars (name, path, size, type, author_id) VALUES (?, ?, ?, ?, ?);`;
        const params = [req.files.photo.name, newPath, newSize, newType, newAuthor];
        const result = await db.executeQuery(query, params);
        if (result.affectedRows === 1) {
            // Update user photo.
            const query = `UPDATE accounts SET photo = ? WHERE id = ?;`;
            const params = [newPath, newAuthor];
            const result = await db.executeQuery(query, params);
            if (result.affectedRows === 1) {
                req.files.photo.mv('public/avatar/' + newName);
                return res.status(200).json({
                    message: 'Photo successfully updated.',
                    result: result
                });
            } else {
                return res.status(500).json({
                    message: 'Photo update failed 2.'
                });
            }
        } else {
            res.status(500).json({
                message: 'Photo update failed 1.'
            });
        }
    }

    // update user data
    async update(req, res) {
        const { user_id } = req.params;
        const { login, full_name, email, role } = req.body;

        // Checking for empty parameters.
        if (!login && !full_name && !email && !role) {
            return res.status(400).json({
                message: 'Nothing to update.'
            });
        }

        const validLogin = await validation.login(login); // Checking login.
        const validFullName = await validation.full_name(full_name); // Checking full name.
        const validEmail = await validation.email_check(email); // Checking email.
        const validRole = await validation.role(role); // Checking role.
        const query = `UPDATE accounts SET login = ?, full_name = ?, email = ?, role = ? WHERE id = ?;`; 
        const params = [validLogin, validFullName, validEmail, validRole, user_id]; 
        const result = await db.executeQuery(query, params);
        if (result.affectedRows === 1) {
            res.status(200).json({
                message: 'User successfully updated.',
                result: result
            });
        } else {
            res.status(500).json({
                message: 'User update failed.'
            });
        }
    }

    // Delete user user_id[token].
    async delete(req, res) {
        const { id } = req.params;
        const { user } = req.session;

        // Check if the user's id or login is recommended with what's in the token.
        const decoded = await jwt.verify(user.token, process.env.SECRET);
        if (decoded.id !== id) {
            return res.status(401).json({
                message: 'You are not authorized to perform this action.'
            });
        }

        // Check if the user belongs to the Administrators group.
        const query = `SELECT role FROM accounts WHERE id = ?;`;
        const params = [id];
        const result = await db.executeQuery(query, params);
        if (result[0].role === 'Admin') {
            return res.status(401).json({
                message: 'You are not authorized to perform this action.'
            });
        }

        // Delete user.
        const query2 = `DELETE FROM accounts WHERE id = ?;`;
        const params2 = [id];
        const result2 = await db.executeQuery(query2, params2);
        if (result2.affectedRows === 1) {
            res.status(200).json({
                message: 'User successfully deleted.',
                result: result2
            });
        }
        else {
            res.status(500).json({
                message: 'User deletion failed.'
            });
        }
    }
}

module.exports = new users; // export the class object to use in other files.