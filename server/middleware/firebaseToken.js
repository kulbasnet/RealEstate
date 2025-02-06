const admin =require('firebase-admin');

async function verifyToken(req, res, next) {
    const idToken = req.headers.authorization?.split("Bearer ")[1]; // Ensure proper token format
  
    if (!idToken) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }

module.exports={verifyToken};