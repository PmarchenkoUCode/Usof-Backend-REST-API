// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//               || Path: routes/catetories.js                      //
//                                                                  //
//              Router for the catetories routes                    //
//          (getAllCategories, getCategory, getPosts,               //
//        createCategory, updateCategory, deleteCategory).          //
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
const category = require('../controllers/categoryController'); // For categories
const localStrategy = require('../middleware/localStrategy'); // For authentication

// For getting all categories.
router.get('/', category.getAllCategories); 

// For getting one category by id.
router.get('/:category_id', category.getCategory);

// For getting all posts by category id.
router.get('/:category_id/posts', category.getPosts);

// For creating a new category (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.post('/', localStrategy.isAuth, category.createCategory);

// For updating a category by id (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.patch('/:category_id', localStrategy.isAuth, category.updateCategory);

// For deleting a category by id (if user is logged in).
// localStrategy.isAuth is a middleware that checks if user is logged in.
router.delete('/:category_id', localStrategy.isAuth, category.deleteCategory);

module.exports = router; // export the router