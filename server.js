require("dotenv").config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const connectToMongo = require('./model/config'); // ✅ updated to import mongoose connection
const UserRoute = require('./routes/UserRoute');
const CourseBook = require('./routes/BookRoute');

const app = express();
const PORT = 3001;

// CORS
app.use(cors({
    origin: ["http://localhost:3000", "https://library-mis.vercel.app"],
    credentials: true
}));

app.use(express.json());

// Session
app.use(session({
    secret: process.env.SECRET_KEY || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Routes
app.use("/api/user", UserRoute);
app.use("/api/books", CourseBook);

// Health check
app.get('/', (req, res) => {
    res.send("Library API is live and connected to MongoDB!");
});

// ✅ Start server AFTER connecting to MongoDB via Mongoose
connectToMongo().then(() => {
    app.listen(PORT, () => {
        console.log("🚀 Server is running on port " + PORT);
    });
}).catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
});
