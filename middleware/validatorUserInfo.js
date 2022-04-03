// Class Validator User Info create validator for auth.

class ValidatorUserInfo {
    // Validator for login.
    // Not less than 5 characters and not more than 20 characters.
    // No spaces, work only with latin letters.
    // No special characters.
    async login(login) {
        if (login.length < 4 || login.length > 20) {
            return false;
        }
        if (!/^[a-zA-Z0-9]+$/.test(login)) {
            return false;
        }
        return login;
    }

    // Validator for password.
    // Not less than 6 characters and not more than 20 characters.
    // No spaces, work only with latin letters.
    // One capital letter and one number.
    async password(password) {
        if (password.length < 6 || password.length > 20) {
            return false;
        }
        if (!/^[a-zA-Z0-9]+$/.test(password)) {
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            return false;
        }
        if (!/[0-9]/.test(password)) {
            return false;
        }
        return password;
    }

    // Validator for full name.
    // Not less than 2 characters and not more than 20 characters.
    // Should be two words.
    // First word should be capital letter.
    // Second word should be capital letter.
    async full_name(full_name) {
        const full_name_array = full_name.split(' ');
        if (full_name_array.length !== 2) {
            return false;
        }
        for (let i = 0; i < full_name_array.length; i++) {
            if (full_name_array[i].length < 2) {
                return false;
            }
            if (full_name_array[i].charAt(0) !== full_name_array[i].charAt(0).toUpperCase()) {
                return false;
            }
        }
        return full_name;
    }

    // Validator for email.
    // No spaces string.
    // before @ should be at least 2 characters.
    // before @ should be latin letters.
    // after @ should be latin letters.
    // after @ should be .com or .ru
    async email(email) {
        if (email.includes(' ')) {
            return false;
        }
        if (!/[@]/.test(email)) {
            return false;
        }
        if (!email.includes('.com') && !email.includes('.ua')) {
            return 3;
        }
        return email;
    }

    // Validator for role.
    async role(role) {
        if (role === 'User' || role === 'Admin') {
            return role;
        }
        return false;
    }

    // Validator for status.
    async status(status) {
        if (status === 'Active' || status === 'Inactive') {
            return status;
        }
        return false;
    }
}

module.exports = new ValidatorUserInfo;