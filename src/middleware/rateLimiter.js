// rateLimiter.js
import redisClient from "../config/db_config/redis.js";

const WINDOW_SIZE_IN_SECONDS = 60; 
const MAX_REQUESTS = 10; 

export default async function rateLimiter(req, res, next) {
    
  try {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
      return res.status(400).json({ error: 'API key missing' });
    }

    const redisKey = `rate_limit:${apiKey}`;

  console.log(redisKey,"rediskey")
    const currentRequests = await redisClient.incr(redisKey);

    if (currentRequests === 1) {
    
      await redisClient.expire(redisKey, WINDOW_SIZE_IN_SECONDS);
    }
     
    console.log(currentRequests)
    if (currentRequests > MAX_REQUESTS) {
      return res.status(429).json({
        error: `Rate limit exceeded. Max ${MAX_REQUESTS} requests per ${WINDOW_SIZE_IN_SECONDS} seconds.`
      });
    }

    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
