const userModel = require('../models/User');
const User = userModel;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { generateVerificationToken } = require('../utils/generateVerificationToken');
const { generateJWTToken } = require('../utils/generateJWTToken');
const House = require('../models/House');
const { sendPasswordResetEmail, sendResetSuccessEmail, sendWelcomeEmail, sendVerificationEmail } = require('../Resend/nodemail');

// Never send these to a client.
const SENSITIVE = '-password -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt';

// Fields a user may NEVER set through updateUser, whatever the request body says.
const PROTECTED_UPDATE_FIELDS = [
    '_id', 'uid', 'password', 'email', 'isAgent', 'isVerified', 'createdHouse',
    'verificationToken', 'verificationTokenExpiresAt', 'resetPasswordToken', 'resetPasswordExpiresAt',
    'createdAt', 'updatedAt',
];

const publicUser = (user) => ({
    _id: user._id,
    uid: user.uid,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isAgent: user.isAgent,
    isVerified: user.isVerified,
});

// First entry of CLIENT_URL (it may hold several comma-separated origins)
const frontendBase = () => (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim().replace(/\/$/, '');


const userSignUp = async (req, res) => {
    try {
        const { name, email, password, isAgent, phoneNumber } = req.body;
        const img = req.file;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ success: false, error: 'Name is required', message: 'Name is required' });
        }
        if (typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Demo mode: set AUTO_VERIFY_USERS=true to skip email verification (useful while Resend has no verified domain).
        const autoVerify = process.env.AUTO_VERIFY_USERS === 'true';
        const verificationToken = generateVerificationToken();

        const user = new userModel({
            uid: uuidv4(),
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            isAgent,
            phoneNumber,
            ...(img && { img: { data: img.buffer, contentType: img.mimetype } }),
            isVerified: autoVerify,
            verificationToken: autoVerify ? undefined : verificationToken,
            verificationTokenExpiresAt: autoVerify ? undefined : Date.now() + 24 * 60 * 60 * 1000,
        });
        await user.save();
        generateJWTToken(res, user._id);

        // The account is saved; a failed email must not turn into a confusing error.
        let emailSent = false;
        if (!autoVerify) {
            try {
                await sendVerificationEmail(user.email, verificationToken);
                emailSent = true;
            } catch (e) {
                console.error('Verification email failed:', e.message);
            }
        }

        res.status(201).json({
            success: true,
            message: autoVerify
                ? 'User registered successfully'
                : emailSent
                    ? 'User registered successfully'
                    : 'User registered, but the verification email could not be sent',
            emailSent,
            user: publicUser(user), // no password, no verification code, no image bytes
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


const verifyEmail = async (req, res) => {
    const { code } = req.body;

    if (typeof code !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        sendWelcomeEmail(user.email, user.name).catch((e) => console.error('Welcome email failed', e));
        res.status(200).json({ success: true, message: 'Email verifified succesfully' });
    } catch (error) {
        console.log('Error verifiying emails', error);
        res.status(400).json({ success: false, message: error.message });
    }
};


// PUBLIC route: must never return password hashes or tokens
const userAlphabetSort = async (req, res) => {
    try {
        const { order = 'asc' } = req.query;

        const sortedAgents = await userModel
            .find({ isAgent: true })
            .select(SENSITIVE)
            .sort({ name: order === 'desc' ? -1 : 1 });

        if (sortedAgents.length === 0) {
            return res.status(404).json({ success: false, message: 'Sorry, no agents found' });
        }

        res.status(200).json({ success: true, message: 'Successfully sorted', data: sortedAgents });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Not wired to any route (kept so the export list is unchanged)
const decendingSort = async () => {};


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ success: false, error: 'Invalid Credintials' });
        }

        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, error: 'Invalid Credintials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: 'email is not verified' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                isAgent: user.isAgent,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.json({ success: true, message: user.isAgent ? 'Agent is logged in ' : 'User logged in ', token, isAgent: user.isAgent });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


const userLogout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out' });
};


const forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (typeof email !== 'string') {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        // Same answer whether or not the account exists, so emails can't be enumerated.
        if (!user) {
            return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await user.save();

        const resetUrl = new URL(`/reset-password/${resetPasswordToken}`, frontendBase()).toString();
        await sendPasswordResetEmail(user.email, resetUrl);

        res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' });
    } catch (error) {
        console.log('eroor on sending reset password email', error);
        res.status(400).json({ success: false, message: error.message });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalied or expired token' });
        }
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: 'Passwrod reset successfully' });
    } catch (error) {
        console.log('Error resetting password', error);
        res.status(400).json({ success: false, message: error.message });
    }
};


// Logged-in route: agents with their info and images (no hashes/tokens)
const getUser = async (req, res) => {
    try {
        const agents = await userModel.find({ isAgent: true }).select(SENSITIVE);

        const agentWithImages = agents.map((agent) => {
            if (agent.img && agent.img.data) {
                const base64img = agent.img.data.toString('base64');
                return {
                    ...agent._doc,
                    img: `data: ${agent.img.contentType}; base64, ${base64img}`,
                };
            }
            return agent;
        });
        res.status(200).json({ message: 'Agents with their information', user: agentWithImages });
    } catch (error) {
        return res.status(400).json({ message: 'Sorry could not fo it ', error: error.message });
    }
};


// NOTE: this lists every non-agent user. If only the admin portal uses it, add requireAdmin to its route.
const getUserOnly = async (req, res) => {
    try {
        const users = await userModel.find({ isAgent: false }).select(SENSITIVE);
        res.status(200).json({ message: 'Users inforamtion', users });
    } catch (error) {
        return res.status(404).json({ message: 'Sorry cannot found the list of users', error: error.message });
    }
};


const userInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select(SENSITIVE);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let userWithImage = { ...user._doc };
        if (user.img && user.img.data) {
            const base64img = user.img.data.toString('base64');
            userWithImage.img = `data:${user.img.contentType};base64,${base64img}`;
        }

        res.status(200).json({ success: true, user: userWithImage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Route guard (authenticate + requireSelfOrAdmin) runs before this.
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const img = req.file;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid id' });
        }

        // Start from the request body, then strip everything a user must not control.
        const updated = { ...req.body };
        for (const key of PROTECTED_UPDATE_FIELDS) delete updated[key];

        if (img) {
            updated.img = { data: img.buffer, contentType: img.mimetype };
        }

        if (Object.keys(updated).length === 0) {
            return res.status(400).json({ success: false, message: 'Nothing to update' });
        }

        const user = await userModel
            .findOneAndUpdate({ _id: id }, { $set: updated }, { new: true, runValidators: true })
            .select(SENSITIVE);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userResponse = user.toObject();
        if (userResponse.img && userResponse.img.data) {
            userResponse.img.data = userResponse.img.data.toString('base64');
        }

        res.status(200).json({ success: true, message: 'User updated successfully', userResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Route guard (authenticate + requireSelfOrAdmin) runs before this.
const userDelete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid id' });
        }

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Sorry no such users' });
        }

        if (user.createdHouse && user.createdHouse.length > 0) {
            await House.deleteMany({ _id: { $in: user.createdHouse } });
        }

        const data = await userModel.findOneAndDelete({ _id: id }).select(SENSITIVE);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Sorry no such users' });
        }
        res.status(200).json({ success: true, deleted: publicUser(data) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// PUBLIC route: must never return password hashes or tokens
const searchUser = async (req, res) => {
    try {
        const { name } = req.query;
        if (typeof name !== 'string') {
            return res.status(400).json({ success: false, error: 'name is required' });
        }
        const nameArray = name.split(',');
        const agents = await userModel.find({ name: { $in: nameArray }, isAgent: true }).select(SENSITIVE);
        if (agents.length === 0) {
            return res.status(404).json({ success: false, message: 'Sorry no agents listed' });
        }
        return res.status(200).json({ success: true, agents });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    userSignUp,
    userLogin,
    getUser,
    verifyEmail,
    userLogout,
    forgetPassword,
    resetPassword,
    updateUser,
    searchUser,
    userAlphabetSort,
    decendingSort,
    userDelete,
    userInfo,
    getUserOnly,
};