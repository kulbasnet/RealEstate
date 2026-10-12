const adminModel = require("../models/AdminMo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require("../Resend/nodemail");
const { generateVerificationToken } = require("../utils/generateVerificationToken");

// Fields that must never be sent back to a client.
const SENSITIVE_FIELDS = "-password -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt";

// Only these fields may ever leave the server in create/update/delete responses.
const publicAdmin = (admin) => ({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    phoneNumber: admin.phoneNumber,
    isAdmin: admin.isAdmin,
    isVerified: admin.isVerified,
});

// First entry of CLIENT_URL (it may hold several comma-separated origins)
const frontendBase = () => (process.env.CLIENT_URL || "").split(",")[0].trim().replace(/\/$/, "");


const createUser = async (req, res) => {
    try {
        const { name, phoneNumber, email, password, isAdmin } = req.body;
        const img = req.file;

        // typeof checks also block NoSQL-injection payloads like {"email": {"$ne": null}}
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || !name.trim() || !email.trim()) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ success: false, message: "Sorry email is already on use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        const admin = new adminModel({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            phoneNumber,
            // multipart forms send strings. This route is gated by adminSignupGate, so only an admin gets here.
            isAdmin: isAdmin === true || isAdmin === "true",
            ...(img && { img: { data: img.buffer, contentType: img.mimetype } }),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        await admin.save();

        // The account is saved; a failed email must not turn into a confusing error.
        let emailSent = true;
        try {
            await sendVerificationEmail(admin.email, verificationToken);
        } catch (e) {
            emailSent = false;
            console.error("Verification email failed:", e.message);
        }

        return res.status(201).json({
            success: true,
            message: emailSent ? "admin Registered" : "admin Registered, but the verification email could not be sent",
            emailSent,
            admin: publicAdmin(admin),
        });
    } catch (error) {
        console.error("createUser error:", error);
        return res.status(400).json({ success: false, error: error.message });
    }
};


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ success: false, message: "Invalid credintails" });
        }

        const admin = await adminModel.findOne({ email });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(400).json({ success: false, message: "Invalid credintails" });
        }

        const token = jwt.sign(
            {
                _id: admin._id,
                email: admin.email,
                name: admin.name,
                isAdmin: admin.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ success: true, message: "Admin Logged IN", token, isAdmin: admin.isAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const adminVerify = async (req, res) => {
    const { code } = req.body;

    if (typeof code !== "string") {
        return res.status(400).json({ success: false, message: "Invalid or expired verifucation code" });
    }

    try {
        const admin = await adminModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(404).json({ success: false, message: "Invalid or expired verifucation code" });
        }

        admin.isVerified = true;
        admin.verificationToken = undefined;
        admin.verificationTokenExpiresAt = undefined;
        await admin.save();

        sendWelcomeEmail(admin.email, admin.name).catch((e) => console.error("Welcome email failed", e));
        res.status(200).json({ success: true, message: "Email verified successfull" });
    } catch (error) {
        console.log("Erorr verifying email", error);
        res.status(404).json({ success: false, message: error.message });
    }
};


const adminForget = async (req, res) => {
    const { email } = req.body;

    if (typeof email !== "string") {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const admin = await adminModel.findOne({ email });

        // Same answer whether or not the email exists, so accounts can't be enumerated.
        if (!admin) {
            return res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent" });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        admin.resetPasswordToken = resetPasswordToken;
        admin.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await admin.save();
        await sendPasswordResetEmail(admin.email, `${frontendBase()}/adminResetPassword/${resetPasswordToken}`);
        res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent" });
    } catch (error) {
        console.log("eroor on sending reset password email", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


const adminResetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    try {
        const admin = await adminModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(400).json({ success: false, message: "No such admin" });
        }

        admin.password = await bcrypt.hash(password, 10);
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpiresAt = undefined;
        await admin.save();

        await sendResetSuccessEmail(admin.email);
        res.status(200).json({ success: true, message: "Passwrod reset Successfull" });
    } catch (error) {
        console.log("Error resetting password", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


const adminInfo = async (req, res) => {
    try {
        // Never send the password hash or tokens back, even to the owner.
        const admin = await adminModel.findById(req.admin._id).select(SENSITIVE_FIELDS);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Sorry no such admins" });
        }

        let adminwithImages = { ...admin._doc };
        if (admin.img && admin.img.data) {
            const base64img = admin.img.data.toString("base64");
            adminwithImages.img = `data: ${admin.img.contentType}; base64, ${base64img}`;
        }

        res.status(200).json({ success: true, data: adminwithImages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Route is protected by authenticate + requireAdmin
const adminDelete = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid id" });
        }

        const data = await adminModel.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "SOrry no such Admins" });
        }

        res.status(200).json({ success: true, deleted: publicAdmin(data) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const adminUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid id" });
        }

        // Allowed: updating your own profile, or an admin updating anyone.
        const isSelf = String(req.user._id) === id;
        if (!isSelf) {
            const requester = await adminModel.findById(req.user._id).select("isAdmin");
            if (!requester || requester.isAdmin !== true) {
                return res.status(403).json({ success: false, message: "Not allowed" });
            }
        }

        // Whitelist. Never $set req.body: it would allow changing isAdmin, email, password, tokens...
        const updates = {};
        for (const key of ["name", "phoneNumber"]) {
            if (typeof req.body[key] === "string") updates[key] = req.body[key].trim();
        }
        if (req.file) {
            updates.img = { data: req.file.buffer, contentType: req.file.mimetype };
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "Nothing to update" });
        }

        const admin = await adminModel.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Sorry no such admin" });
        }

        // Same response shape as before: adminResponse.img.data is base64
        const adminResponse = publicAdmin(admin);
        if (admin.img && admin.img.data) {
            adminResponse.img = { contentType: admin.img.contentType, data: admin.img.data.toString("base64") };
        }

        res.status(200).json({ success: true, message: "Admin Updataed", adminResponse });
    } catch (error) {
        console.error("adminUpdate error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { createUser, adminLogin, adminInfo, adminDelete, adminUpdate, adminVerify, adminForget, adminResetPassword };