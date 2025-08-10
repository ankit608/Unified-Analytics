import { v4 as uuidv4 } from 'uuid';
import { App } from '../model/app.js';
import { generateApiKey } from '../utils/Encryption.js';
import { hashApiKey } from '../utils/Encryption.js';
import dayjs from 'dayjs'; // npm install dayjs

export const RegisterApp = async (req, res) => {
  try {
    const { name, user_id } = req.body;

    const { plainKey, hashedKey } = generateApiKey();

 
    const expiresAt = dayjs().add(90, 'day').toDate();

    const app = await App.create({
      id: uuidv4(),
      name,
      user_id,
      revoked:true,
      api_key: hashedKey,
      api_key_expiry: expiresAt
    });

    res.status(201).json({
      message: 'App created successfully',
      app: {
        id: app.id,
        name: app.name,
        user_id: app.user_id,
        expires_at: app.expires_at
      },
      api_key: plainKey // show only once
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getUserApps = async (req, res) => {
  try {
    const { user_id } = req.params;
    const apps = await App.findAll({ where: { user_id } });
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAppById = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await App.findByPk(id);
    if (!app) return res.status(404).json({ message: 'App not found' });
    res.status(200).json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateApp = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const app = await App.findByPk(id);
    if (!app) return res.status(404).json({ message: 'App not found' });

    await app.update({ name, status });

    res.status(200).json({ message: 'App updated successfully', app });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteApp = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await App.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'App not found' });

    res.status(200).json({ message: 'App deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REGENERATE API KEY
export const regenerateApiKey = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await App.findByPk(id);
    if (!app) return res.status(404).json({ message: 'App not found' });

    const { plainKey, hashedKey } = generateApiKey();
    await app.update({ api_key: hashedKey });

    res.status(200).json({
      message: 'API key regenerated successfully',
      api_key: plainKey, // show plain key only once
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get_API_KEY.js

export const Get_API_KEY = async (req, res, next) => {
  try {
    const app = await App.findOne({
      where: {
        user_id: req.user_id, // ensure this is set earlier in middleware
        name: req.body.name   // or req.params.name depending on how it's passed
      }
    });

    if (!app) {
      return res.status(404).json({ error: "App not found" });
    }

   
    return res.json({ apiKey: app.apiKey });

  } catch (error) {
    console.error("Error fetching API key:", error);
    next(error); 
  }
};


// controllers/appController.js



export const RevokeAPI_Key = async (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(400).json({ message: 'Missing API key in headers' });
  }

  try {
    const hashedKey = hashApiKey(apiKey);

    const app = await App.findOne({ where: { api_key: hashedKey } });

    if (!app) {
      return res.status(404).json({ message: 'API key not found' });
    }

    if (app.revoked) {
      return res.status(400).json({ message: 'API key is already revoked' });
    }


    app.revoked = true;
    await app.save();

    res.status(200).json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Failed to revoke API key:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
