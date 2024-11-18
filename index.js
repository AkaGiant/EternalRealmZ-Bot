require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const path = require('path');
const { CommandHandler } = require('djs-commander');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const databaseName = process.env.MONGODB_DATABASE_NAME;
let database;
let mongoClient;

async function connectMongo() {
  if (database) { 
    return console.log('Already connected to MongoDB!'); 
  }

  try {
    // Create MongoClient with connection pooling options
    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,   // Set max number of connections in the pool
      minPoolSize: 2,    // Set min number of connections to maintain
      waitQueueTimeoutMS: 25000, // Set timeout for waiting for available connection
      maxIdleTimeMS: 600000, // Close idle connections after 10 minutes
    });

    await mongoClient.connect();
    console.log('Connected to MongoDB!');

    // Access the specified database
    database = mongoClient.db(databaseName);
    console.log(`Connected to the ${database.databaseName} database.`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}

connectMongo();

// Set up the Discord client
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Set up the command handler
new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'src/commands'),
  eventsPath: path.join(__dirname, 'src/events'),
  validationsPath: path.join(__dirname, 'src/validations'),
  testServer: process.env.DEVELOPMENT_SERVER_ID,
});

client.login(process.env.BOT_TOKEN);


// Graceful shutdown and MongoDB connection close
process.on('SIGINT', async () => {
  try {
    console.log('Shutting down...');

    // Close MongoDB client and mongoose connection
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed.');
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Mongoose connection closed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1); 
  }
});

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
console.error('Error during mongoose connection:', err);
});

mongoose.connection.on('disconnected', () => {
console.log('Mongoose disconnected from MongoDB');
});
