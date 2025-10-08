// middleware/auth.js
import { users } from '../config/appwrite.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.headers['x-appwrite-user-id'];
    const sessionId = req.headers['x-appwrite-session-id'];
    
    console.log('Current sessionId:', sessionId);
    
    if (!userId || !sessionId) {
      return res.status(401).json({ error: 'Missing authentication headers' });
    }
    
    const user = await users.get(userId);
    
    req.user = {
      id: user.$id,
      name: user.name,
      email: user.email
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication' });
  }
};
