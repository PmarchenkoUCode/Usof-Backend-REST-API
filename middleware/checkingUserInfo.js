// Checking if the user is online or not from the session.

const db = require('../config/db.config');

class checkUserInfo {
    // Checking the login in the database, if there is one - an error.
    async checkLogin(login) {
        const query = `SELECT * FROM accounts WHERE login = ?;`;
        const params = [login];
        const result = await db.executeQuery(query, params);
        if (result.length === 0) {
            return login;
        }
        return false;
    }

    // Checking the email in the database, if there is one - an error.
    async checkEmail(email) {
        const query = `SELECT * FROM accounts WHERE email = ?;`;
        const params = [email];
        const result = await db.executeQuery(query, params);
        if (result.length === 0) {
            return email;
        }
        return false;
    }
}

module.exports = new checkUserInfo;