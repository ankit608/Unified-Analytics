import express from "express";
import { Event } from "../model/event.js";
import { Op,fn,col} from "sequelize";
import { App } from "../model/app.js"; // Assuming you have an App model
import { getAppIdByApiKey } from "../service/app.js";
const router = express.Router();

export const collectEvent = async (req, res) => {

    const app_id = getAppIdByApiKey(req.headers['x-api-key'])
  try {
    const {
     app_id,
      event,
      url,
      referrer,
      device,
      ipAddress,
      timestamp,
      metadata,
      userId
    } = req.body;


   console.log(app_id,event)

    const newEvent = await Event.create({
     app_id,
      event,
      url,
      referrer,
      device,
      ip_address: ipAddress, 
      timestamp,
      metadata,
      user_id: userId || null
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: error.message });
  }
}


 export const getSummary = async (req, res) => {
  try {
    console.log("hellooo....")
    const { event, startDate, endDate, app_id } = req.query;

    if (!event) {
      return res.status(400).json({ error: "event is required" });
    }

    
    const whereClause = { event };

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp[Op.gte] = new Date(startDate);
      if (endDate) whereClause.timestamp[Op.lte] = new Date(endDate);
    }

    if (app_id) {
      whereClause.app_id = app_id;
    } else {
      const userApps = await App.findAll({
        where: { owner_id: req.user.id },
        attributes: ["id"]
      });
      whereClause.app_id = userApps.map(app => app.id);
    }

    // Total count
    const totalCount = await Event.count({ where: whereClause });

    // Unique users
    const uniqueUsers = await Event.count({
      where: whereClause,
      distinct: true,
      col: "user_id"
    });

  
    const deviceDataRaw = await Event.findAll({
      where: whereClause,
      attributes: ["device", [fn("COUNT", col("id")), "count"]],
      group: ["device"]
    });

    const deviceData = {};
    deviceDataRaw.forEach(row => {
      deviceData[row.device] = parseInt(row.get("count"), 10);
    });

    // Response
    res.json({
      event,
      count: totalCount,
      uniqueUsers,
      deviceData
    });
  } catch (error) {
    console.error("Error fetching event summary:", error);
    res.status(500).json({ error: error.message });
  }
}



export const userStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Total event count for this user
    const totalEvents = await Event.count({
      where: { user_id: userId }
    });

    // Latest event for this user (to get device details, ip)
    const latestEvent = await Event.findOne({
      where: { user_id: userId },
      order: [["timestamp", "DESC"]],
      attributes: ["metadata", "ip_address"]
    });

    if (!latestEvent) {
      return res.status(404).json({ error: "No events found for this user" });
    }

    const { metadata, ip_address } = latestEvent;

    res.json({
      userId,
      totalEvents,
      deviceDetails: {
        browser: metadata?.browser || "unknown",
        os: metadata?.os || "unknown"
      },
      ipAddress: ip_address || "unknown"
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: error.message });
  }
}