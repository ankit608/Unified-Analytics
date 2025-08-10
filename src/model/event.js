import sequelize from "../config/db_config/db.js";
import { DataTypes } from "sequelize";
import { NOW } from "sequelize";

 
export const Event = sequelize.define(
  'event',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    app_id: {
  type: DataTypes.UUID,
  allowNull: false,
  references: {
    model: 'apps', // or App model name
    key: 'id'
  }
},
    event: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    referrer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    device: {
      type: DataTypes.ENUM('mobile', 'desktop', 'tablet'),
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.STRING, // Optional unique ID from client
      allowNull: true,
    },
  },
  {
    tableName: 'events',
    underscored: true,
    timestamps: true,
  }
);