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

// Embed schema
const embedSchema = new mongoose.Schema({
  title: { type: String, maxlength: 256 },
  description: { type: String, maxlength: 4096 },
  url: { type: String, match: /^https?:\/\/[^\s$.?#].[^\s]*$/ },
  color: { type: Number, min: 0, max: 16777215 },
  timestamp: { type: Date },
  footer: {
    text: { type: String, maxlength: 2048 },
    icon_url: { type: String, match: /^https?:\/\/[^\s$.?#].[^\s]*$/ },
  },
  image: {
    url: { type: String, match: /^https?:\/\/[^\s$.?#].[^\s]*$/ },
  },
  thumbnail: {
    url: { type: String, match: /^https?:\/\/[^\s$.?#].[^\s]*$/ },
  },
  author: {
    name: { type: String, maxlength: 256 },
    url: { type: String, match: /^https?:\/\/[^\s$.?#].[^\s]*$/ },
    icon_url: { type: String, match: /^https?:\/\/[^\s$.?#].[^\s]*$/ },
  },
  fields: [
    {
      name: { type: String, maxlength: 256, required: true },
      value: { type: String, maxlength: 1024, required: true },
      inline: { type: Boolean, default: false },
    },
  ],
});

const welcomeLeaveSettingsSchema = new mongoose.Schema({
  welcomeChannelId: { type: String, required: false },
  leaveChannelId: { type: String, required: false },
  welcomeEmbed: { type: embedSchema, required: false },
  leaveEmbed: { type: embedSchema, required: false }, 
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
  welcomeLeaveSettings: [welcomeLeaveSettingsSchema],
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
