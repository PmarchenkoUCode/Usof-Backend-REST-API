class checkinAvatarUser {
    // Check photo size.
    // Check photo type.
    // Check photo name.
    // Check photo path.
    async checkPhoto(req, res) {
        const { photo } = req.files;
        const { size, mimetype } = photo;
        const { name } = photo;
        if (size > 5000000) {
            return res.status(201).json({
                message: 'Photo size is too big.'
            });
        }
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(201).json({
                message: 'Photo type is not valid.'
            });
        }
        if (name.length > 50) {
            return res.status(201).json({
                message: 'Photo name is too long.'
            });
        }
    }
}

module.exports = new checkinAvatarUser();