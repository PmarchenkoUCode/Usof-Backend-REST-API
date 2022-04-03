// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                 || Language: javascript                          //
//           || Path: controllers/aurtControlles.js                 //
//                                                                  //
// ====================== || Author data || ======================= //
//                                                                  //
//          Code author - Pavlo Marchenko.                          //
//          Email - programmingmarchenko@gmail.com                  //
//          GitHub - https://github.com/PmarchenkoUCode.            //
//                                                                  //
// ================================================================ //

const bcrypt = require('bcrypt'); // for hashing passwords
const jwt = require('jsonwebtoken'); // for generating and verifying tokens
const dotenv = require('dotenv'); // for loading environment variables
const db = require('../config/db.config'); // for database
const nodeMailer = require('nodemailer'); // for sending emails
const validation = require('../middleware/validatorUserInfo'); // for checking the user info
const check = require('../middleware/checkingUserInfo'); // for checking the user info
dotenv.config(); // load environment variables

// Class users create users.
class authentication {
    // registration of a new user, required parameters are[login, password, full_name, photo_id, email, role].
    // ExecuteQuery [query, params]
    async register(req, res) {
        const { login, password, full_name, email } = req.body;
        if (!login || !password || !full_name || !email) {
            res.status(400).json({
                message: 'Bad request.'
            });
        }

        const query = `SELECT * FROM accounts;`;
        const result = await db.executeQuery(query);
        if (result.length === 0) {
            const { login, password, full_name, email } = req.body;
            const validLogin = await validation.login(login);
            const validPassword = await validation.password(password);
            const validEmail = await validation.email(email);
            const validFullName = await validation.full_name(full_name);
            const hash = await bcrypt.hash(validPassword, 12);
            if (validLogin && hash && validEmail && validFullName) {
                const query = `INSERT INTO accounts (login, password, full_name, email, role) VALUES (?, ?, ?, ?, ?);`;
                const params = [login, hash, full_name, email, 'Admin'];
                const result = await db.executeQuery(query, params);
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        message: 'User successfully registered.'
                    });
                } else {
                    res.status(500).json({
                        message: 'User registration failed.'
                    });
                }
            } else {
                res.status(400).json({
                    message: 'User registration failed.'
                });
            }
        } else {
            const { login, password, full_name, email } = req.body;
            const validLogin = await validation.login(login);
            const validPassword = await validation.password(password);
            const validEmail = await validation.email(email);
            const validFullName = await validation.full_name(full_name);
            const checkLogin = await check.checkLogin(validLogin);
            const checkEmail = await check.checkEmail(validEmail);
            const hash = await bcrypt.hash(validPassword, 10);
            if (checkLogin && hash && checkEmail && validFullName) {
                const query = `INSERT INTO accounts (login, password, full_name, email) VALUES (?, ?, ?, ?);`;
                const params = [checkLogin, hash, validFullName, checkEmail];
                const result = await db.executeQuery(query, params);
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        message: 'User successfully registered.'
                    });
                } else {
                    res.status(500).json({
                        message: 'User registration failed.'
                    });
                }
            } else {
                res.status(400).json({
                    message: 'User registration failed.'
                });
            }
        }
    }

    // log in as a user, required parameters [login, email, password], Write a session and create a token.
    // Session [login, token].
    // Only users with a verified email address can log in.
    // ExecuteQuery [query, parameters]
    async login(req, res) {
        const { login, email, password } = req.body;
        const validLogin = await validation.login(login);
        const validEmail = await validation.email(email);
        const validPassword = await validation.password(password);
        const query = `SELECT * FROM accounts WHERE login = ? AND email = ?;`;
        const params = [validLogin, validEmail];
        const result = await db.executeQuery(query, params);
        if (result.length === 0) {
            return res.status(201).json({
                message: 'Login or email is incorrect.'
            });
        }
        const hash = result[0].password;
        const checkPassword = await bcrypt.compare(validPassword, hash);
        if (checkPassword === false) {
            return res.status(201).json({
                message: 'Password is incorrect.'
            });
        }

        // Password is correct, create a token.
        const token = jwt.sign({
            id: result[0].id,
            login: result[0].login,
            email: result[0].email,
            role: result[0].role,
            exprime: Date.now() + 1000 * 60 * 60 * 24 * 7
        }, process.env.SECRET, {
            expiresIn: '1h'
        });
        
        // Save session.
        const session = {
            id: result[0].id,
            login: result[0].login,
            token: token
        };

        req.session.user = session;
        req.session.save();

        res.status(200).json({
            message: 'User successfully logged in.',
            token: token
        });
    }

    // login user, save session, create token.
    async logout(req, res) {
        req.session.destroy();
        res.status(200).json({
            message: 'User successfully logged out.'
        });
    }

    // send a reset link to user email, requiredparameter is [email].
    // ExecuteQuery [query, parameters]
    async resetPassword(req, res) {
        const { user } = req.session;
        const { email } = req.body;
        const decoded = await jwt.verify(user.token, process.env.SECRET);

        // Compare token.email and email body if they match true, else false.
        if (decoded.email && email) {
            if (decoded.email === email) {
                return res.status(200).json({
                    message: 'Email is correct.'
                });
            } else {
                return res.status(201).json({
                    message: 'Email is incorrect.'
                });
            }
        }

        const validEmail = await validation.email(email);
        const query = `SELECT * FROM accounts WHERE email = ?;`;
        const params = [validEmail];
        const result = await db.executeQuery(query, params);
        if (result.length === 0) {
            return res.status(201).json({
                message: 'Email is incorrect.'
            });
        }
        const token = jwt.sign({
            email: validEmail
        }, process.env.SECRET, {
            expiresIn: '1h'
        });
        
        const transporter = nodeMailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'a6ejiupt6q6scv3u@ethereal.email',
                pass: 'VXg5KqnTmNvm6MubHB'
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: validEmail,
            subject: 'Reset password',
            html: `<p>You requested for reset password, kindly use this <a href="http://localhost:3000/api/auth/password-reset/${token}">link</a> to reset your password</p>`
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.status(200).json({
            message: 'Reset password link was sent to your email.'
        });
    }

    // confirm new password with a token from email, required parameter is a [new password] token jwt.
    // ExecuteQuery [query, parameters]
    async confirmPassword(req, res) {
        const { confirm_token } = req.params; // token from email
        const { new_password } = req.body; // new password

        if (!confirm_token || !new_password) {
            return res.status(400).json({
                message: 'Token or new password is incorrect.'
            });
        }

        // Verify token.
        const decoded = jwt.verify(confirm_token, process.env.SECRET);
        const email = decoded.email;

        const validPassword = await validation.password(new_password);
        const hash = await bcrypt.hash(validPassword, 10);
        const query = `UPDATE accounts SET password = ? WHERE email = ?;`;
        const params = [hash, email];
        const result = await db.executeQuery(query, params);
        if (result.affectedRows > 0) {
            res.status(200).json({
                message: 'Password successfully changed.'
            });
        } else {
            res.status(500).json({
                message: 'Password change failed.'
            });
        }
    }
}     

module.exports = new authentication(); // export the class