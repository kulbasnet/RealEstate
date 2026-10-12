const { Resend } = require('resend');
const { verificationTokenEmailTemplate, welcome_email_template } = require('./email-template');

// Resend sends over HTTPS (port 443), so it works on hosts that block SMTP (Render Free).
// The client is created lazily so a missing key doesn't crash the whole server at startup.
let client;
const getClient = () => {
    if (!process.env.RESEND_API_KEY) {
        const error = new Error('Email is not configured. Set RESEND_API_KEY (and EMAIL_FROM) in the environment.');
        error.code = 'EMAIL_NOT_CONFIGURED';
        throw error;
    }
    if (!client) client = new Resend(process.env.RESEND_API_KEY);
    return client;
};

// Without a verified domain Resend only delivers to your own account email.
// Set EMAIL_FROM to an address on your verified domain for real users.
const getFrom = () => process.env.EMAIL_FROM || 'Basnet Realties <onboarding@resend.dev>';

const escapeHtml = (value = '') =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// The Resend SDK returns { data, error } and does NOT throw on API errors, so check it.
const send = async ({ to, subject, html, text }) => {
    const { data, error } = await getClient().emails.send({ from: getFrom(), to, subject, html, text });
    if (error) {
        const err = new Error(error.message || 'Failed to send email');
        err.code = error.name;
        throw err;
    }
    return data;
};

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        await send({
            to: email,
            subject: 'Verify your email',
            html: verificationTokenEmailTemplate.replace('{verificationToken}', escapeHtml(verificationToken)),
        });
        console.log('Verification email sent');
    } catch (error) {
        console.error('Verification email error:', error);
        throw error;
    }
};

const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const safeUrl = escapeHtml(resetUrl);
        await send({
            to: email,
            subject: 'Reset Your Password',
            text: `Reset your password using this link: ${resetUrl}`,
            html: `<p>Click the link below to reset your password:</p><p><a href="${safeUrl}">Reset your password</a></p><p>If the link does not work, copy and paste this URL into your browser:</p><p>${safeUrl}</p>`,
        });
        console.log('Password reset email sent');
    } catch (err) {
        console.error('Error sending password reset email:', err);
        throw new Error('Failed to send password reset email');
    }
};

const sendResetSuccessEmail = async (email) => {
    try {
        await send({
            to: email,
            subject: 'Password Changed Successfully',
            text: 'Your password has been changed successfully',
        });
        console.log('Password change confirmation sent');
    } catch (err) {
        console.error('Error sending password change confirmation:', err);
        throw new Error('Failed to send password change confirmation');
    }
};

const sendWelcomeEmail = async (email, name) => {
    try {
        await send({
            to: email,
            subject: 'Welcome to Basnet Realties',
            html: welcome_email_template.replace('{name}', escapeHtml(name)), // name is user-supplied
        });
        console.log('Welcome email sent');
    } catch (err) {
        console.error('Error sending welcome email:', err);
        throw new Error('Failed to send welcome email');
    }
};

// Same behaviour as before: log failures but never break the booking flow.
const sendBookingConfirmation = async (email, status) => {
    try {
        await send({
            to: email,
            subject: 'Appointment Booking',
            text: `Your Appointment has been ${status}. Please remember your date.\n\nThank you,\nBasnet Realties`,
        });
        console.log(`Booking status email sent to ${email}`);
    } catch (error) {
        console.error('Error sending booking email:', error);
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendWelcomeEmail,
    sendBookingConfirmation,
};