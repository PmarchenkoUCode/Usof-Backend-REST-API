// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//          || Path: controllers/categoryController.js              //
//                                                                  //
//          Router for the categoryController routes                //
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

const db = require('../config/db.config'); // import database configuration
const checking = require('../middleware/checkingPosting'); // import checking

class category {
    // get all categories
    // Display no more than 10 categories..
    async getAllCategories(req, res) {
        const query = `SELECT * FROM categories ORDER BY id DESC LIMIT 10;`;
        const result = await db.executeQuery(query);
        if (result.length > 0) {
            return res.status(200).json({
                message: 'Categories successfully fetched.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Categories fetch failed.'
            });
        }
    }


    // get categories by category_id - post_category[category_id];
    // required parameters are[category_id].
    // ExecuteQuery [query, params]
    async getCategory(req, res) {
        const query = `SELECT * FROM categories WHERE id = ?;`;
        const params = [req.params.category_id];
        const result = await db.executeQuery(query, params);
        if (result.length > 0) {
            return res.status(200).json({
                message: 'Category successfully fetched.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Category fetch failed.'
            });
        }   
    }

    // From post_category, display all posts in the given category (Post name and category).
    // required parameters are[category_id].
    // ExecuteQuery [query, params]
    async getPosts(req, res) {
        const query = `SELECT * FROM post_category INNER JOIN post ON post_category.post_id = post.id WHERE post_category.category_id = ?;`;
        const params = [req.params.category_id];
        const result = await db.executeQuery(query, params);
        if (result.length > 0) {
            return res.status(200).json({
                message: 'Posts successfully fetched.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Posts fetch failed.'
            });
        }
    }


    // Create a category, required parameter is [category].
    // Checking if the category already exists.
    // ExecuteQuery [query, params]
    async createCategory(req, res) {
        // UserID from session.
        const query1 = `SELECT id FROM accounts WHERE login = ?;`;
        const params1 = [req.session.user.login];
        const resultLogin = await db.executeQuery(query1, params1);
        if (resultLogin.length === 0) {
            return res.status(201).json({
                message: 'User not found.'
            });
        }

        const { category } = req.body;
        // Checking if the category already exists. 
        const checkCategory = await checking.checkCategories(category); // Checking if the category is empty or not.
        if (checkCategory === false) {
            return res.status(201).json({
                message: 'Category already exists.'
            });
        }

        const query = `SELECT * FROM categories WHERE category = ?;`; // Checking if the category already exists.
        const params = [category];
        const result = await db.executeQuery(query, params);
        if (result.length > 0) {
            return res.status(201).json({
                message: 'Category already exists.'
            });
        } else {
            const query = `INSERT INTO categories (category, author_id) VALUES (?, (SELECT id FROM accounts WHERE login = ?));`;
            const params = [category, req.session.user.login];
            const result = await db.executeQuery(query, params);
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    message: 'Category successfully created.'
                });
            } else {
                return res.status(201).json({
                    message: 'Category creation failed.'
                });
            }
        }
    }    

    // update a category, required parameter is [category_id, category].
    // ExecuteQuery [query, params]
    async updateCategory(req, res) {
        const { category_id } = req.params;
        const { category } = req.body;

        const query1 = `SELECT author_id FROM categories WHERE id = ?;`;
        const params1 = [category_id];
        const result1 = await db.executeQuery(query1, params1);
        if (result1.length !== 0) {
            if (result1[0].author_id === req.session.user.id) {
                const query = `UPDATE categories SET category = ? WHERE id = ?;`;
                const params = [category, category_id];
                const result = await db.executeQuery(query, params);
                if (result.affectedRows > 0) {
                    return res.status(200).json({
                        message: 'Category successfully updated.'
                    });
                } else {
                    return res.status(201).json({
                        message: 'Category update failed.'
                    });
                }
            }
        }
    }

    // delete a category, required parameter is [category_id].
    // ExecuteQuery [query, params]
    async deleteCategory(req, res) {
        const { category_id } = req.params;

        const query1 = `SELECT author_id FROM categories WHERE id = ?;`;
        const params1 = [category_id];
        const result1 = await db.executeQuery(query1, params1);
        if (result1.length !== 0) {
            if (result1[0].author_id === req.session.user.id) {
                const query = `DELETE FROM categories WHERE id = ?;`;
                const params = [category_id];
                const result = await db.executeQuery(query, params);
                if (result.affectedRows > 0) {
                    return res.status(200).json({
                        message: 'Category successfully deleted.'
                    });
                } else {
                    return res.status(201).json({
                        message: 'Category deletion failed.'
                    });
                }
            }
        }
    }
}

module.exports = new category; // export the class object to use in other files.