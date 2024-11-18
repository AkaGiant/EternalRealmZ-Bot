const mongoose = require('mongoose'); 

const defaultTraders = ['Black Market', 'Consumables', 'Weapons', 'Vehicles'];

const traderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the trader
  items: {
    type: Map,
    of: new mongoose.Schema({
      buyPrice: { type: Number, default: null },
      sellPrice: { type: Number, default: null },
      missing: { type: Boolean, default: false },
      reportedMissing: { type: Boolean, default: false },
      confirmedSet: { type: Boolean, default: false } 
    })
  }
});

// Define the schema
const guildConfigurationSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  settings: {
    traders: {
      type: [traderSchema], // This defines an array of `traderSchema`
      default: [] // Default value as an empty array
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the `updatedAt` field
guildConfigurationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model from the schema
const GuildConfiguration = mongoose.model('GuildConfiguration', guildConfigurationSchema);

module.exports = GuildConfiguration;
