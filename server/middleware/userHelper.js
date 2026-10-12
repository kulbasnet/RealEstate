const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashedPassword = async (password) => {
    if (typeof password !== 'string' || password.length === 0) {
        throw new Error('Password must be a non-empty string');
    }
    return bcrypt.hash(password, SALT_ROUNDS);
};

// Returns false for bad input instead of touching res; the caller decides the HTTP response.
const comparedPassword = async (password, hashed) => {
    if (typeof password !== 'string' || typeof hashed !== 'string') return false;
    return bcrypt.compare(password, hashed);
};

module.exports = { hashedPassword, comparedPassword };