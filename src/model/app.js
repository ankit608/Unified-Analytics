import sequelize from "../config/db_config/db.js";
import { DataTypes } from "sequelize";
export const App = sequelize.define(
  'apps',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    revoked:{
         type: DataTypes.BOOLEAN,
         allowNull:false,
         defaultValue:true
    },
    api_key: {
      type: DataTypes.STRING, // hashed API key
      allowNull: false,
    },
    api_key_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'revoked'),
      defaultValue: 'active',
    },
  },
  {
    tableName: 'apps',
    underscored: true,
    timestamps: true,
  }
);
