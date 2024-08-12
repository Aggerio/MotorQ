function auth(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');
    const scheme = parts[0];
    const token = parts[1];

    // Check if the scheme is "Hello" instead of "Basic"
    if (scheme !== 'Hello' || !token) {
        return res.status(403).json({ message: 'Invalid authorization scheme or token missing' });
    }

    // Your token verification logic here
    const validToken = "Motorq"; // Replace with your actual logic

    if (token !== validToken) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    next();
}

module.exports = auth;