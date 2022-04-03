// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//                  || Path: routes/auth.js                         //
//                                                                  //
//                 Router for the auth routes                       //
// (login, logout, register, password-reset, password-reset/:token).//
//                                                                  //
// ====================== || Author data || ======================= //
//                                                                  //
//          Code author - Pavlo Marchenko.                          //
//          Email - programmingmarchenko@gmail.com                  //
//          GitHub - https://github.com/PmarchenkoUCode.            //
//                                                                  //
// ================================================================ //

const express = require('express'); // import express
const router = express.Router(); // create an instance of express
const authentication = require('../controllers/authController'); // for authentication
const passport = require('passport'); // for authentication 
const localStrategy = require('../middleware/localStrategy'); // for authentication 

// For registering a new user (if user doesn't exist).
// localStrategy.userExist is a middleware that checks if user exists.
router.post('/register', localStrategy.userExist, authentication.register); 

// For logging in a user (if user exists). 
// passport.authenticate('local') is a middleware that checks if user exists.
router.post('/login', passport.authenticate('local'), authentication.login); 

// For logging out a user (if user is logged in). 
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.post('/logout', localStrategy.isAuth, authentication.logout); 

// For resetting a user's password (if user is logged in). 
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.post('/password-reset', localStrategy.isAuth, authentication.resetPassword);

// For confirming a user's password (if user is logged in). 
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.post('/password-reset/:confirm_token', localStrategy.isAuth, authentication.confirmPassword);

module.exports = router; // export the router