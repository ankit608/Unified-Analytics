import  sequelize  from '../config/db_config/db.js'; // assuming sequelize instance exported here
import { App } from './app.js';
import { Event } from './event.js';
import { User } from './user.js';

User.hasMany(App, { foreignKey: 'user_id', onDelete: 'CASCADE' });
App.belongsTo(User, { foreignKey: 'user_id' });

App.hasMany(Event, { foreignKey: 'app_id', onDelete: 'CASCADE' });
Event.belongsTo(App, { foreignKey: 'app_id' });
sequelize.sync({ alter: true }) // or { force: true }
  .then(() => console.log("✅ Tables created"))
  .catch(err => console.error("❌ Error creating tables:", err));
export {
  sequelize,
  User,
  App,
  Event,
};