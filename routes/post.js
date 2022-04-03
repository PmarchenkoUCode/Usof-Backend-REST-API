// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//                  || Path: routes/post.js                         //
//                                                                  //
//                 Router for the post routes                       //
//      (getAllPosts, getPost, getComments, createComment,          //
//        getCategories, getLikes, createPost, createLike,          //
//          updatePost, deletePost, deleteLikePost).                //
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
const post = require('../controllers/postController'); // for posts
const localStrategy = require('../middleware/localStrategy'); // for authentication

// For getting all posts (if user is logged in).
router.get('/', post.getAllPosts);

// For getting one post by id (by default, id is the logged in user).
router.get('/:post_id', post.getPost);

// For getting all comments by post id (if user is logged in).
router.get('/:post_id/comments', post.getComments);

// For creating a new comment (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.post('/:post_id/comments', localStrategy.isAuth, post.createComment);

// For getting categories of a post by id (if user is logged in).
router.get('/:post_id/categories', post.getCategories);

// For getting a post's like by id (if user is logged in).
router.get('/:post_id/like', post.getLikes);

// For creating a new post (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.post('/', localStrategy.isAuth, post.createPost);

// For creating a new like (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.post('/:post_id/like', localStrategy.isAuth, post.createLike);

// For updating a post by id (if user is logged in). 
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.patch('/:post_id', localStrategy.isAuth, post.updatePost);

// For deleting a post by id (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.delete('/post_id', localStrategy.isAuth, post.deletePost);

// For deleting a like by post id (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.delete('/:post_id/like', localStrategy.isAuth, post.deleteLikePost);

module.exports = router; // export the router