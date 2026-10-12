// middleware/requireAdmin.js
// Use AFTER `authenticate`. A valid JWT alone is not enough: the token's _id must belong to
// an Admin document with isAdmin === true. A regular user's token will never match.
const mongoose = require('mongoose');
const adminModel = require('../models/AdminMo');

const requireAdmin = async (req, res, next) => {
    try {
        const id = req.user && req.user._id;
        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(403).json({ success: false, message: 'Admin access required.' });
        }

        const admin = await adminModel.findById(id).select('isAdmin');
        if (!admin || admin.isAdmin !== true) {
            return res.status(403).json({ success: false, message: 'Admin access required.' });
        }

        next();
    } catch (err) {
        console.error('requireAdmin error:', err.message);
        return res.status(500).json({ success: false, message: 'Authorization check failed.' });
    }
};

module.exports = requireAdmin;