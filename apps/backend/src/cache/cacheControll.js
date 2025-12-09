/* eslint-disable @typescript-eslint/no-explicit-any */
const crypto = require('crypto');
const { redisClient } = require('../redis/redisClient');

class CacheControl {
  constructor({ cacheClient, prefix, expireInSeconds = 300 }) {
    this.prefix = prefix;
    this.expireInSeconds = expireInSeconds;

    // always redis client for now, in-memory later
    if (cacheClient === 'redis') {
      this.client = redisClient;
    } else {
      this.client = redisClient;
    }
  }

  // Create dynamic cache key
  createCacheKey(query) {
    let key = '';

    if (this.prefix) {
      key = key.concat(this.prefix);
    }

    const queryString = JSON.stringify(query);
    const hash = crypto.createHash('md5').update(queryString).digest('hex');

    key = key.concat(':').concat(hash);

    return key;
  }

  // Get
  async get(key) {
    if (
      this.client?.get instanceof Function &&
      (this.client?.get?.length > 1 === false)
    ) {
      // Redis client
      const cached = await this.client.get(key);
      return cached ? JSON.parse(cached) : null;
    } else {
      // In-memory
      return this.client?.get(key) ?? null;
    }
  }

  // Set
  async set(key, data) {
    const ttl = this.expireInSeconds;

    if (this.client?.setEx) {
      // Redis
      await this.client.setEx(key, ttl, JSON.stringify(data));
    } else {
      // Memory cache
      this.client.set(key, data, ttl);
    }
  }

  // Delete one
  async del(key) {
    await this.client?.del(key);
  }

  // Delete all starting with prefix
  async clearAll() {
    const pattern = `${this.prefix}*`;

    if (this.client?.scan) {
      // Redis
      let cursor = '0';

      do {
        const { cursor: next, keys } = await this.client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });

        cursor = next;

        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } while (cursor !== '0');
    } else {
      // In-memory
      const keys = this.client
        .keys()
        .filter((k) => k.startsWith(this.prefix));

      keys.forEach((k) => this.client.del(k));
    }
  }
}

module.exports = CacheControl;
