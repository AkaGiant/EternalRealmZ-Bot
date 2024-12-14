const mongoose = require("mongoose");

// One to Many to Many
// One guild can have many changelogs
// One changelog can have many changes.

// Define the ChangeLog schema
const changeLogSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the changelog
  description: { type: String, default: "" }, // Optional description for the changelog
  version: { type: String, required: true, default: "0.0.1" },
  published: { type: Boolean, required: true, default: false },
  changes: {
    // Specific changes per changelog.
    type: Map,
    of: new mongoose.Schema({
      changeId: { type: String, required: true }, // ID of the item being changed
      changeType: { type: String, required: true }, // Type of change: 'added', 'removed', 'updated'
      details: { type: String, default: "" }, // Details of the change
    }),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const traderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: {
    type: Map,
    of: new mongoose.Schema({
      buyPrice: { type: Number, default: null },
      sellPrice: { type: Number, default: null },
      missing: { type: Boolean, default: false },
      reportedMissing: { type: Boolean, default: false },
      confirmedSet: { type: Boolean, default: false },
    }),
  },
});

// Define the schema
const guildConfigurationSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  settings: {
    traders: {
      type: [traderSchema],
      default: [],
    },
  },
  changelogs: [changeLogSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

guildConfigurationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const GuildConfiguration = mongoose.model(
  "GuildConfiguration",
  guildConfigurationSchema
);

module.exports = GuildConfiguration;
