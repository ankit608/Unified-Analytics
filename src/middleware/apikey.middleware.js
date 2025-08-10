
import { App } from "../model";

export const checkApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ message: 'Missing API key' });
  }

  try {
    const hashedKey = hashApiKey(apiKey); 
    const app = await App.findOne({
      where: {
        api_key: hashedKey,
        revoked: false
      }
    });

    if (!app) {
      return res.status(403).json({ message: 'Invalid or revoked API key' });
    }

    // Check expiration
    const now = new Date();
    if (app.expires_at && now > app.expires_at) {
      return res.status(403).json({ message: 'API key has expired' });
    }

    req.appData = app;
    next();
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
