// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                    Passport Local Strategy                       //
//                  || Language: javascript                         //
//                  || Path: models/localStrategy.js                //
//                                                                  //
// ====================== || Author data || ======================= //
//                                                                  //
//          Code author - Pasha Marchenko.                          //
//          Email - programmingmarchenko@gmail.com                  //
//          GitHub - https://github.com/PmarchenkoUCode.            //
//                                                                  //
// ================================================================ //

const LocalStrategy = require("passport-local").Strategy; // middelware for authentication
const bcrypt = require('bcrypt'); // middelware for authentication
const passport = require("passport"); // middelware for authentication
const db = require("../config/db.config"); // middelware for authentication

const customFields = { // custom fields for passport
    usernameField: "login",
    passwordField: "password",
    passReqToCallback: true
};

// Passport verifies the user's credentials and calls this function
// with the user's information.
const verifyCallback = async (req, login, password, done) => {
    const query = `SELECT * FROM accounts WHERE login = ?;`;
    const params = [login];
    const result = await db.executeQuery(query, params);
    if (result.length > 0) {
        const user = result[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            done(null, user);
        } else {
            done(null, false);
        }
    } else {
        done(null, false);
    }
}

const strategy = new LocalStrategy(customFields, verifyCallback); // Passport verifies the user's credentials and calls this function
passport.use(strategy); // middelware for authentication

passport.serializeUser((user, done) => { 
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log("deserializeUser");
    const query = `SELECT * FROM accounts WHERE id = ?;`;
    const params = [id];
    const result = await db.executeQuery(query, params);
    if (result.length > 0) {
        done(null, result[0]);
    } else {
        console.log("deserializeUser", "User not found");
        done(null, false);
    }
});

// middelware for authentication
// check if user is authenticated
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        message: "Not authorized"
    });
}

// moddleware for authentication
// check if user is admin
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "Admin") {
        return next();
    }
    res.status(401).json({
        message: "Not authorized"
    });
}

// moddleware for authentication
// check if user exists
const userExist = async (req, res, next) => {
    const query = `SELECT * FROM accounts WHERE login = ?;`;
    const params = [req.body.login];
    const result = await db.executeQuery(query, params);
    if (result.length > 0) {
        res.status(400).json({
            message: "User already exist"
        });
    } else {
        next();
    }
}

module.exports = { isAuth, isAdmin, userExist }; // middelware for authentication
