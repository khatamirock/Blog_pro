const { MongoClient } = require("mongodb");
const dotnv = require("dotenv");
dotnv.config();

const uri = process.env.MONG_URL;

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db('blogUsers');
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { connectToDatabase };
