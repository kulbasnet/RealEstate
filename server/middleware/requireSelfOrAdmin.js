// middleware/requireSelfOrAdmin.js
// Use AFTER `authenticate`. Allows the request only if the logged-in person is acting on
// their own record (:id matches the token), or is a real admin (isAdmin === true in the Admin collection).
const mongoose = require('mongoose');
const adminModel = require('../models/AdminMo');

const requireSelfOrAdmin = async (req, res, next) => {
    try {
        // The claim name depends on how the login token is signed; the common variants are covered.
        const requesterId = req.user && (req.user._id || req.user.id || req.user.userId);
        const targetId = req.params.id;

        if (!requesterId || !mongoose.isValidObjectId(requesterId) || !mongoose.isValidObjectId(targetId)) {
            return res.status(403).json({ success: false, message: 'Not allowed' });
        }

        if (String(requesterId) === String(targetId)) return next();

        const admin = await adminModel.findById(requesterId).select('isAdmin');
        if (admin && admin.isAdmin === true) return next();

        return res.status(403).json({ success: false, message: 'Not allowed' });
    } catch (err) {
        console.error('requireSelfOrAdmin error:', err.message);
        return res.status(500).json({ success: false, message: 'Authorization check failed' });
    }
};

module.exports = requireSelfOrAdmin;