// =======================  Description  ========================== //
//          RESTful API for usof-backend(StackOverflow)             //
//            App.js - main file for the application.               //
//                                                                  //
//                  || Language: javascript                         //
//         || Path: controllers/commentController.js:               //
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

class comment {
    // get specified comment data. Endpoint is private.
    // required parameters are [comment_id].
    // Get post LEFT JOIN accounts on post.author_id = account.id without password data
    // ExecuteQuery [query, params]
    async getComment(req, res) {
        const { comment_id } = req.params;
        const query = `SELECT comment.id, comment.content, comment.created_at, comment.updated_at, comment.author_id, accounts.login, accounts.full_name, accounts.email FROM comment 
                        LEFT JOIN accounts ON comment.author_id = accounts.id WHERE comment.id = ?;`;
        const params = [comment_id];
        const result = await db.executeQuery(query, params);
        if (result.length > 0) {
            return res.status(200).json({
                message: 'Comment successfully fetched.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Comment fetch failed.'
            });
        }
    }
    
    // get all likes under the specified comment. Endpoint is private.
    // required parameters are [comment_id].
    // Get post LEFT JOIN accounts on post.author_id = account.id without password data
    // ExecuteQuery [query, params]
    async getLikes(req, res) {
        const { comment_id } = req.params;
        const query = `SELECT * FROM likecomment WHERE comment_id = ?;`;
        const params = [comment_id];
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

    // create a like under the specified comment. Endpoint is private.
    // required parameters are [comment_id].
    // ExecuteQuery [query, params]
    async createLike(req, res) {
        // UserID from session.
        const query1 = `SELECT id FROM accounts WHERE login = ?;`;
        const params1 = [req.session.user.login];
        const resultLogin = await db.executeQuery(query1, params1);
        if (resultLogin.length === 0) {
            return res.status(201).json({
                message: 'User not found.'
            });
        }

        const { comment_id } = req.params;
        if (!comment_id) {
            return res.status(400).json({
                message: 'Comment ID is required.'
            });
        }

        // Check if user already liked the comment.
        const query = `INSERT INTO likecomment (author_id, comment_id) VALUES ((SELECT id FROM accounts WHERE login = ?), ?);`;
        const params = [req.session.user.login, comment_id];
        const result = await db.executeQuery(query, params);

        if (result.length > 0) {
            return res.status(200).json({
                message: 'Like successfully created.',
                result: result
            });
        } else {
            return res.status(201).json({
                message: 'Like creation failed.'
            });
        }
    }

    // update specified comment data. Endpoint is private.
    // required parameters are [comment_id].
    // ExecuteQuery [query, params]
    async updateComment(req, res) {
        const { comment_id } = req.params;
        const { content } = req.body;

        const query = `SELECT author_id FROM comment WHERE id = ?;`;
        const params = [comment_id];
        const result = await db.executeQuery(query, params);
        if (result.length !== 0) {
            if (result[0].author_id === req.session.user.id) {
                const query = `UPDATE comment SET content = ? WHERE id = ?;`;
                const params = [content, comment_id];
                const result = await db.executeQuery(query, params);
                if (result.length > 0) {
                    return res.status(200).json({
                        message: 'Comment successfully updated.',
                        result: result
                    });
                } else {
                    return res.status(201).json({
                        message: 'Comment update failed.'
                    });
                }
            } else {
                return res.status(201).json({
                    message: 'You are not the author of this comment.'
                });
            }
        } else {
            return res.status(201).json({
                message: 'Comment not found.'
            });
        }
    }

    // delete specified comment data. Endpoint is private.
    // required parameters are [comment_id].
    // ExecuteQuery [query, params]
    async deleteComment(req, res) {
        const { comment_id } = req.params;

        const query1 = `SELECT author_id FROM categories WHERE id = ?;`;
        const params1 = [category_id];
        const result1 = await db.executeQuery(query1, params1);
        if (result1.length !== 0) {
            if (result1[0].author_id === req.session.user.id) {
                const query = `DELETE FROM comment WHERE id = ?;`;
                const params = [comment_id];
                const result = await db.executeQuery(query, params);
                if (result.length > 0) {
                    return res.status(200).json({
                        message: 'Comment successfully deleted.',
                        result: result
                    });
                } else {
                    return res.status(201).json({
                        message: 'Comment deletion failed.'
                    });
                }
            } else {
                return res.status(201).json({
                    message: 'You are not the author of this comment.'
                });
            }
        } else {
            return res.status(201).json({
                message: 'Comment not found.'
            });
        }
    }

    // delete specified like data. Endpoint is private.
    // required parameters are [comment_id].
    // ExecuteQuery [query, params]
    async deleteLike(req, res) {
        const { comment_id } = req.params;

        const query1 = `SELECT author_id FROM categories WHERE id = ?;`;
        const params1 = [category_id];
        const result1 = await db.executeQuery(query1, params1);
        if (result1.length !== 0) {
            if (result1[0].author_id === req.session.user.id) {
                const query = `DELETE FROM likecomment WHERE comment_id = ?;`;
                const params = [comment_id];
                const result = await db.executeQuery(query, params);
                if (result.length > 0) {
                    return res.status(200).json({
                        message: 'Like successfully deleted.',
                        result: result
                    });
                } else {
                    return res.status(201).json({
                        message: 'Like deletion failed.'
                    });
                }
            }
        } else {
            return res.status(201).json({
                message: 'Like not found.'
            });
        }
    }
}

module.exports = new comment; // export the class object to use in other files.