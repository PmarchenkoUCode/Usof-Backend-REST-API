// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//            || Path: controllers/postController.js                //
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

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const checkingPost = require('../middleware/checkingPosting');


class post {
    // get all posts.
    // Display no more than 10 posts.
    // Get post LEFT JOIN accounts on post.author_id = account.id without password data.
    // ExecuteQuery [query, params]
    async getAllPosts(req, res) {
        const query = `SELECT post.id, post.title, post.content, post.created_at, post.updated_at, post.author_id, accounts.login, accounts.full_name, accounts.email FROM post 
                        LEFT JOIN accounts ON post.author_id = accounts.id ORDER BY post.created_at DESC LIMIT 10;`;
        const params = [];
        const result = await db.executeQuery(query, params);
        if (result.length === 0) {
            return res.status(201).json({
                message: 'No posts found.'
            });
        }
        return res.status(200).json({
            message: 'Posts found.',
            result: result
        });
    }

    // get all posts under the specified post_id.
    // Get post LEFT JOIN accounts on post.author_id = account.id without password data.
    // ExecuteQuery [query, params]
    async getPost(req, res) {
        const { post_id } = req.params;
        const query = `SELECT post.id, post.title, post.content, post.created_at, post.updated_at, post.author_id, accounts.login, accounts.full_name, accounts.email FROM post 
                        LEFT JOIN accounts ON post.author_id = accounts.id WHERE post.id = ?;`;
        const params = [post_id];
        const result = await db.executeQuery(query, params);
        if (result.length > 0) {
            return res.status(200).json({
                message: 'Post successfully fetched.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Post fetch failed.'
            });
        }
    }

    // get all comments for the specified post. Endpoint is public.
    // Get post LEFT JOIN accounts on post.author_id = account.id without password data.
    // required parameters are[post_id].
    // ExecuteQuery [query, params]
    async getComments(req, res) {
        const { post_id } = req.params;
        const query = `SELECT comment.id, comment.content, comment.created_at, comment.updated_at, comment.author_id, accounts.login, accounts.full_name, accounts.email FROM comment 
                        LEFT JOIN accounts ON comment.author_id = accounts.id WHERE comment.post_id = ?;`;
        const params = [post_id];
        const result = await db.executeQuery(query, params);
        if (result.length > 0) {
            return res.status(200).json({
                message: 'Comments successfully fetched.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Comments fetch failed.'
            });
        }
    }

    // Create a new comment, required parameteris [content]
    // author_id is automatically set to the current user.
    // post_id is automatically set to the post_id of the post the comment is created under.
    // ExecuteQuery [query, params]
    async createComment(req, res) {
        const { post_id } = req.params;
        const { content } = req.body;

        if (!post_id || !content) {
            return res.status(201).json({
                message: 'Missing required parameters.'
            });
        }

        const contentChecking = await checkingPost.checkContent(content);
        if (contentChecking === false) {
            return res.status(201).json({
                message: 'Missing required fields - contentChecking.'
            });
        }

        const query1 = `SELECT id FROM accounts WHERE login = ?;`;
        const params1 = [req.session.user.login];
        if (req.session.user.login === undefined) {
            return res.status(201).json({
                message: 'You are not logged in.'
            });
        }

        const resultLogin = await db.executeQuery(query1, params1);
        const query = `INSERT INTO comment (content, author_id, post_id) VALUES (?, ?, ?);`;
        const params = [content, resultLogin[0].id, post_id];
        const result = await db.executeQuery(query, params);
        if (result.affectedRows === 1) {
            return res.status(200).json({
                message: 'Comment successfully created.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Comment creation failed.'
            });
        }
    }

    // get all post_category associated with the specified post.
    // required parameters are[post_id].
    // parameters are[post_id].
    // ExecuteQuery [query, params]
    async getCategories(req, res) {
        const { post_id } = req.params;
        const query = `SELECT categories.id, categories.category FROM post_category LEFT JOIN categories ON post_category.category_id = categories.id WHERE post_category.post_id = ?;`;
        const params = [post_id];
        const result = await db.executeQuery(query, params);
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

    // get all likes under the specified post. Endpoint is public.
    // required parameters are[id].
    // Get post LEFT JOIN accounts on post.author_id = account.id without password data.
    // ExecuteQuery [query, params]
    async getLikes(req, res) {
        const { post_id } = req.params;
        const query = `SELECT likepost.id, likepost.created_at, likepost.updated_at, likepost.author_id, likepost.post_id, accounts.login, accounts.full_name, accounts.email FROM likepost
                        LEFT JOIN accounts ON likepost.author_id = accounts.id WHERE likepost.post_id = ?;`;
        const params = [post_id];
        const result = await db.executeQuery(query, params);
        if (result.length > 0) {
            return res.status(200).json({
                message: 'Likes successfully fetched.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Likes fetch failed.'
            });
        }
    }

    // create a new post, required parameters are [title, content, categories].
    // FOREIGN KEY (author_id) REFERENCES accounts(id) ON DELETE CASCADE
    // ExecuteQuery [query, params]
    async createPost(req, res) {
        const query1 = `SELECT id FROM accounts WHERE login = ?;`;
        const params1 = [req.session.user.login];
        const resultLogin = await db.executeQuery(query1, params1);
        const { title, content, categories } = req.body;

        if (!title || !content || !categories || !resultLogin[0].id) {
            return res.status(201).json({
                message: 'Missing required fields.'
            });
        }

        // Parameter Check [title, content, categories] - checkingPost is a boolean.
        const titleChecking = await checkingPost.checkTitle(title);
        if (titleChecking === false) {
            return res.status(201).json({
                message: 'Missing required fields - titleChecking.'
            });
        }

        const contentChecking = await checkingPost.checkContent(content);
        if (contentChecking === false) {
            return res.status(201).json({
                message: 'Missing required fields - contentChecking.'
            });
        }

        const categoriesChecking = await checkingPost.checkCategories(categories);
        if (categoriesChecking === false) {
            return res.status(201).json({
                message: 'Missing required fields - categoriesChecking.'
            });
        }

        // Check for the presence of a category with a name..
        const query2 = `SELECT id FROM categories WHERE category = ?;`;
        const params2 = [categories];
        const resultCategory = await db.executeQuery(query2, params2);
        if (resultCategory.length === 0) {
            // If there is already such a content with such text, an error is returned.
            const query3 = `SELECT * FROM post WHERE content = ?;`;
            const params3 = [content];
            const resultContent = await db.executeQuery(query3, params3);
            if (resultContent.length === 0) {
                // If there is no such content with such text, a new category is created.
                const query4 = `INSERT INTO categories (category) VALUES (?);`;
                const params4 = [categories];
                const resultCategory = await db.executeQuery(query4, params4);
                if (resultCategory.affectedRows === 1) {
                    // If the category is successfully created, a new post is created.
                    const query5 = `INSERT INTO post (title, content, author_id) VALUES (?, ?, ?);`;
                    const params5 = [title, content, resultLogin[0].id];
                    const resultPost = await db.executeQuery(query5, params5);
                    if (resultPost.affectedRows === 1) {
                        // If the post is successfully created, a new post_category is created.
                        const query6 = `INSERT INTO post_category (post_id, category_id) VALUES (?, (SELECT id FROM categories WHERE category = ?));`;
                        const params6 = [resultPost.insertId, categories];
                        const resultPostCategory = await db.executeQuery(query6, params6);
                        if (resultPostCategory.affectedRows === 1) {
                            return res.status(200).json({
                                message: 'Post successfully created.',
                                result: resultPost
                            });
                        } else {
                            return res.status(201).json({
                                message: 'Post creation failed.'
                            });
                        }
                    } else {
                        return res.status(201).json({
                            message: 'Post creation failed.'
                        });
                    }
                } else {
                    return res.status(201).json({   
                        message: 'Category creation failed.'
                    });
                }
            } else {
                return res.status(201).json({
                    message: 'Content already exists.'
                });
            }
        } else {
            // If there is already such a category with such text, an error is returned.
            const query3 = `SELECT * FROM post WHERE content = ?;`;
            const params3 = [content];
            const resultContent = await db.executeQuery(query3, params3);
            if (resultContent.length === 0) {
                // If there is no such content with such text, a new post is created.
                const query4 = `INSERT INTO post (title, content, author_id) VALUES (?, ?, ?);`;
                const params4 = [title, content, resultLogin[0].id];
                const resultPost = await db.executeQuery(query4, params4);
                if (resultPost.affectedRows === 1) {
                    // If the post is successfully created, a new post_category is created.
                    const query5 = `INSERT INTO post_category (post_id, category_id) VALUES (?, (SELECT id FROM categories WHERE category = ?));`;
                    const params5 = [resultPost.insertId, categories];
                    const resultPostCategory = await db.executeQuery(query5, params5);
                    if (resultPostCategory.affectedRows === 1) {
                        return res.status(200).json({
                            message: 'Post successfully created.',
                            result: resultPost
                        });
                    } else {
                        return res.status(201).json({
                            message: 'Post creation failed.'
                        });
                    }
                } else {
                    return res.status(201).json({
                        message: 'Post creation failed.'
                    });
                }
            } else {
                return res.status(201).json({
                    message: 'Content already exists.'
                });
            }
        }
    }

    // Create like post [post_id] - database likepost table[author_id, post_id].
    // ExecuteQuery [query, params]
    async createLike(req, res) {
        const { post_id } = req.params;
        if (!post_id) {
            return res.status(201).json({
                message: 'Missing required fields.'
            });
        }

        // UserID from session.
        const query1 = `SELECT id FROM accounts WHERE login = ?;`;
        const params1 = [req.session.user.login];
        const resultLogin = await db.executeQuery(query1, params1);
        if (resultLogin.length === 0) {
            return res.status(201).json({
                message: 'User not found.'
            });
        }

        const query = `SELECT * FROM likepost WHERE author_id = ? AND post_id = ?;`;
        const params = [resultLogin[0].id , post_id];
        const result = await db.executeQuery(query, params);
        if (result.length === 0) {
            const query1 = `INSERT INTO likepost (author_id, post_id) VALUES (?, ?);`;
            const params1 = [resultLogin[0].id, post_id];
            const resultLike = await db.executeQuery(query1, params1);
            if (resultLike.affectedRows === 1) {
                return res.status(200).json({
                    message: 'Like successfully created.',
                    result: resultLike
                });
            } else {
                return res.status(201).json({
                    message: 'Like creation failed.'
                });
            }
        } else {
            return res.status(201).json({
                message: 'Like already exists.'
            });
        }
    }

    // Update post [post_id] - database post table[title, content, author_id] and update category.
    // Available only to the author of the post.
    // ExecuteQuery [query, params]
    async updatePost(req, res) {
        const { post_id } = req.params;
        if (!post_id) {
            return res.status(201).json({
                message: 'Missing required fields.'
            });
        }

        // UserID from session.
        const query1 = `SELECT id FROM accounts WHERE login = ?;`;
        const params1 = [req.session.user.login];
        const resultLogin = await db.executeQuery(query1, params1);
        if (resultLogin.length === 0) {
            return res.status(201).json({
                message: 'User not found.'
            });
        }

        // Check for the presence of a post with a title..
        const query2 = `SELECT * FROM post WHERE id = ?;`;
        const params2 = [post_id];
        const resultPost = await db.executeQuery(query2, params2);
        if (resultPost.length === 0) {
            return res.status(201).json({
                message: 'Post not found.'
            });
        }

        // Check for the presence of a post with a title..
        const query3 = `SELECT * FROM post WHERE id = ? AND author_id = ?;`;
        const params3 = [post_id, resultLogin[0].id];
        const resultPostAuthor = await db.executeQuery(query3, params3);
        if (resultPostAuthor.length === 0) {
            return res.status(201).json({
                message: 'Post not found.'
            });
        }

        const { title, content, categories } = req.body;
        if (!title || !content || !categories) {
            return res.status(201).json({
                message: 'Missing required fields.'
            });
        }

        // Check for the presence of a category with a name..
        const query4 = `SELECT id FROM categories WHERE category = ?;`;
        const params4 = [categories];
        const resultCategory = await db.executeQuery(query4, params4);
        if (resultCategory.length === 0) {
            // If there is already such a content with such text, an error is returned.
            const query5 = `SELECT * FROM post WHERE title = ?;`;
            const params5 = [title];
            const resultContent = await db.executeQuery(query5, params5);
            if (resultContent.length === 0) {
                // If there is no such content with such text, a new post is created.
                const query6 = `UPDATE post SET title = ?, content = ? WHERE id = ?;`;
                const params6 = [title, content, post_id];
                const resultPost = await db.executeQuery(query6, params6);
                if (resultPost.affectedRows === 1) {
                    // If the post is successfully updated, a new post_category is created.
                    const query7 = `INSERT INTO post_category (post_id, category_id) VALUES (?, (SELECT id FROM categories WHERE category = ?));`;
                    const params7 = [post_id, categories];
                    const resultPostCategory = await db.executeQuery(query7, params7);
                    if (resultPostCategory.affectedRows === 1) {
                        return res.status(200).json({
                            message: 'Post successfully updated.',
                            result: resultPost
                        });
                    } else {
                        return res.status(201).json({
                            message: 'Post update failed.'
                        });
                    }
                } else {
                    return res.status(201).json({
                        message: 'Post update failed.'
                    });
                }
            }
            return res.status(201).json({
                message: 'Content already exists.'
            });
        }
    }

    // delete a post [post_id] - database post table[title, content, author_id] and delete category.
    // Available only to the author of the post.
    // ExecuteQuery [query, params]
    async deletePost(req, res) {
        const { post_id } = req.params;
        if (!post_id) {
            return res.status(201).json({
                message: 'Missing required fields.'
            });
        }

        // UserID from session.
        const query1 = `SELECT id FROM accounts WHERE login = ?;`;
        const params1 = [req.session.user.login];
        const resultLogin = await db.executeQuery(query1, params1);
        if (resultLogin.length === 0) {
            return res.status(201).json({
                message: 'User not found.'
            });
        }

        // Check for the presence of a post with a title..
        const query2 = `SELECT * FROM post WHERE id = ?;`;
        const params2 = [post_id];
        const resultPost = await db.executeQuery(query2, params2);
        if (resultPost.length === 0) {
            return res.status(201).json({
                message: 'Post not found.'
            });
        }

        // Check for the presence of a post with a title..
        const query3 = `SELECT * FROM post WHERE id = ? AND author_id = ?;`;
        const params3 = [post_id, resultLogin[0].id];
        const resultPostAuthor = await db.executeQuery(query3, params3);
        if (resultPostAuthor.length === 0) {
            return res.status(201).json({
                message: 'Post not found.'
            });
        }

        const query4 = `DELETE FROM post WHERE id = ?;`;
        const params4 = [post_id];
        const resultPost1 = await db.executeQuery(query4, params4);
        if (resultPost1.affectedRows === 1) {
            const query5 = `DELETE FROM post_category WHERE post_id = ?;`;
            const params5 = [post_id];
            const resultPostCategory = await db.executeQuery(query5, params5);
            if (resultPostCategory.affectedRows === 1) {
                return res.status(200).json({
                    message: 'Post successfully deleted.',
                    result: resultPost1
                });
            } else {
                return res.status(201).json({
                    message: 'Post delete failed.'
                });
            }
        } else {
            return res.status(201).json({
                message: 'Post delete failed.'
            });
        }
    }

    // delete a likepost under a post [post_id] - database post table[title, content, author_id].
    // Available only to the author of the post.
    // ExecuteQuery [query, params]
    async deleteLikePost(req, res) {
        const { post_id } = req.params;
        if (!post_id) {
            return res.status(201).json({
                message: 'Missing required fields.'
            });
        }

        // UserID from session.
        const query1 = `SELECT id FROM accounts WHERE login = ?;`;
        const params1 = [req.session.user.login];
        const resultLogin = await db.executeQuery(query1, params1);
        if (resultLogin.length === 0) {
            return res.status(201).json({
                message: 'User not found.'
            });
        }

        // Check for the presence of a post with a title..
        const query2 = `SELECT * FROM post WHERE id = ?;`;
        const params2 = [post_id];
        const resultPost = await db.executeQuery(query2, params2);
        if (resultPost.length === 0) {
            return res.status(201).json({
                message: 'Post not found.'
            });
        }

        // Check for the presence of a post with a title..
        const query3 = `SELECT * FROM post WHERE id = ? AND author_id = ?;`;
        const params3 = [post_id, resultLogin[0].id];
        const resultPostAuthor = await db.executeQuery(query3, params3);
        if (resultPostAuthor.length === 0) {
            return res.status(201).json({
                message: 'Post not found.'
            });
        }

        // Delete for the presence of a likepost with a post_id..
        const query4 = `DELETE FROM likepost WHERE author_id = ? AND post_id = ?;`;
        const params4 = [resultLogin[0].id, post_id];
        const resultPost1 = await db.executeQuery(query4, params4);
        if (resultPost1.affectedRows === 1) {
            return res.status(200).json({
                message: 'Post successfully deleted.',
                result: resultPost1
            });
        } else {
            return res.status(201).json({
                message: 'Post delete failed.'
            });
        }
    }
}

module.exports = new post; // export the class object to use in other files.