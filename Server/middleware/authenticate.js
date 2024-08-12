// /middleware/authenticate.js

const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    // if token is not send, 
    if (!authHeader) {
        return res
            .status(401)
            .json({ success: false, message: "Access denied. No token provided." });
    }
    // Token is normally send as Bearer (token), replace the Bearer and only store
    // the token value
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // send the user data payload in req.user
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid token." });
    }
};

module.exports = authenticate;