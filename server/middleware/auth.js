import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token using the secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fakemusicplayer');

    // Attach user ID to request object
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default auth;