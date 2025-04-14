require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;

const connectToMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Mongoose connected to MongoDB");
    } catch (err) {
        console.error("❌ Failed to connect Mongoose:", err);
    }
};

module.exports = connectToMongo;
