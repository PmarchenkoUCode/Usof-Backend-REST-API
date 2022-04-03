// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//                  || Path: routes/users.js                        //
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

const express = require('express'); // import express
const router = express.Router(); // create an instance of express
const users = require('../controllers/userControllers'); // for users
const localStrategy = require('../middleware/localStrategy'); // for authentication

// For getting all users (for all users).
router.get('/', users.getAll);

// For getting one user by id (by default, id is the logged in user).
router.get('/:user_id', users.getOne);

// For creating a new user (if user doesn't exist). 
// isAdmin is a middleware that checks if user is admin.
router.post('/', localStrategy.isAdmin, users.create);

// For updating a user's photo (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.patch('/avatar', localStrategy.isAuth, users.updatePhoto);

// For updating a user's info (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.patch('/:user_id', localStrategy.isAuth, users.update);

// For deleting a user (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.delete('/:id', localStrategy.isAuth, users.delete);

module.exports = router; // export the router