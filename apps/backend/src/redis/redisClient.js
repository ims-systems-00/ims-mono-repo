const { logger } = require('@ims-systems-00/ims-core/lib/logger');
const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => logger.error('Redis Client Connection Error:', err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info('Redis connected');
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
