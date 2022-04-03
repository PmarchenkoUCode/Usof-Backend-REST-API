// Checking post 

class checkingPost {
    // Checking title for length and if it is empty.
    async checkTitle(title) {
        if (title.length > 50) {
            return false;
        }
        if (title.length === 0) {
            return false;
        }
        return true;
    }

    // Checking content for length and if it is empty.
    async checkContent(content) {
        if (content.length > 500) {
            return false;
        }
        if (content.length === 0) {
            return false;
        }
        return true;
    }

    // Checking categories for length and if it is empty.
    async checkCategories(categories) {
        if (categories.length > 30) {
            return false;
        }
        if (categories.length === 0) {
            return false;
        }
        return true;
    }

    // If there is already such a content with such text, an error is returned.
    async checkContentText(contentText) {
        const query = `SELECT * FROM post WHERE content = ?;`;
        const params = [contentText];
        const result = await db.executeQuery(query, params);
        if (result.length === 0) {
            return contentText;
        }
        return false;
    }
}

module.exports = new checkingPost;