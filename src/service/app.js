// services/appService.js
import { App } from "../model/app.js"; // Sequelize model for your app table


export async function getAppIdByApiKey(apiKey) {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const appRecord = await App.findOne({
    where: { api_key: apiKey },
    attributes: ['id'] // Only fetch app_id
  });

  return appRecord ? appRecord.app_id : null;
}


