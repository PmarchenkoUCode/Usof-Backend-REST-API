// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//                || Path: routes/comments.js                       //
//                                                                  //
//                 Router for the comments routes                   //
//               (getComment, getLikes, createLike,                 //
//            updateComment, deleteComment, deleteLike).            //
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
const comment = require('../controllers/commentController'); // for comments
const localStrategy = require('../middleware/localStrategy'); // for authentication

// For getting one comment by id (for all users).
router.get('/:comment_id', comment.getComment);

// For getting a comment's like by id (for all users).
router.get('/:comment_id/like', comment.getLikes);

// For creating a new like (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.post('/:comment_id/like', localStrategy.isAuth, comment.createLike);

// For updating a comment by id (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.patch('/:comment_id', localStrategy.isAuth, comment.updateComment);

// For deleting a comment by id (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.delete('/:comment_id', localStrategy.isAuth, comment.deleteComment);

// For deleting a like by id (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.delete('/:comment_id/like', localStrategy.isAuth, comment.deleteLike);

module.exports = router; // export the router