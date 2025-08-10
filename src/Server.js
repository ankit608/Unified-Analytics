import  "./model/index.js";
import redisClient from "./config/db_config/redis.js";
import { app } from "./app.js"




app.listen(5000,()=>{
    console.log("app is listing to port 5000")
})