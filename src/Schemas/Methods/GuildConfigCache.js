const GuildConfiguration = require('../GuildConfiguration');

class GuildConfigCache {
  constructor() {
    this.cache = new Map();
  }
  async getGuildConfig(guildId) {
    try {
      if (this.cache.has(guildId)) {
        console.log('Cache hit for guild:', guildId);
        return this.cache.get(guildId);
      }
  
      console.log('Cache miss for guild:', guildId);
      let guildConfig = await GuildConfiguration.findOne({ guildId });
  
      if (!guildConfig) {
        guildConfig = new GuildConfiguration({
          guildId: guildId});
        await guildConfig.save();
        console.log(`New guild configuration created for guild: ${guildId}`);
      }
  
      this.cache.set(guildId, guildConfig);
      return guildConfig;
      
    } catch (error) {
      console.error('Error while fetching guild configuration:', error);
      throw new Error('Database error while fetching guild configuration');
    }
  }

  async addTrader(guildId, trader) {
    const guildConfig = await this.getGuildConfig(guildId);

    if (!guildConfig.settings.traders.includes(trader)) {
      guildConfig.settings.traders.push(trader);
    }

    try {
      await guildConfig.save();

      this.cache.set(guildId, guildConfig);
      console.log(`Added trader ${trader} for guild ${guildId}`);
    } catch (error) {
      console.error('Error updating guild configuration:', error);
      throw new Error('Database error while adding trader');
    }
  }

  async removeTrader(guildId, trader) {
    const guildConfig = await this.getGuildConfig(guildId);
    
    guildConfig.settings.traders = guildConfig.settings.traders.filter(item => item !== trader);

    try {
      await guildConfig.save();

      this.cache.set(guildId, guildConfig);
      console.log(`Removed trader ${trader} for guild ${guildId}`);
    } catch (error) {
      console.error('Error updating guild configuration:', error);
      throw new Error('Database error while removing trader');
    }
  }

  async resetTraders(guildId) {
    const guildConfig = await this.getGuildConfig(guildId);
    guildConfig.settings.traders = [];

    try {
      await guildConfig.save();

      this.cache.set(guildId, guildConfig);
      console.log(`Reset traders for guild ${guildId}`);
    } catch (error) {
      console.error('Error updating guild configuration:', error);
      throw new Error('Database error while resetting traders');
    }
  }
}

const guildConfigCache = new GuildConfigCache();
module.exports = guildConfigCache;
