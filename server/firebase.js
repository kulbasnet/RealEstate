const admin = require('firebase-admin');

// Production (Render): the whole service-account JSON lives in ONE environment variable.
// Local development: falls back to ./serviceAccountKey.json (which must stay git-ignored).
const loadServiceAccount = () => {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
    try {
        return require('./serviceAccountKey.json');
    } catch (err) {
        throw new Error(
            'Firebase credentials missing: set FIREBASE_SERVICE_ACCOUNT or add server/serviceAccountKey.json'
        );
    }
};

// Guard so the app is initialised only once, however many files require this module.
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(loadServiceAccount()),
    });
}

module.exports = admin;