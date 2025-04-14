require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Automatically extract DB name from URI
const dbName = new URL(uri).pathname.substring(1); // Removes the leading '/'

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db;

async function connectToMongo() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log(`Connected to MongoDB: ${dbName}`);
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
}

connectToMongo();

module.exports = {
    getDb: () => db,
    client
};
