require("dotenv").config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const { client, getDb } = require('./model/config'); // ✅ use your Mongo config
const UserRoute = require('./routes/UserRoute');
const CourseBook = require('./routes/BookRoute');

const app = express();
const PORT = process.env.PORT || 3006;

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

// Make DB available in routes via app.locals
app.use((req, res, next) => {
    req.db = getDb();
    next();
});

// Routes
app.use("/api/user", UserRoute);
app.use("/api/books", CourseBook);

// Health check
app.get('/', (req, res) => {
    res.send("Library API is live and connected to MongoDB!");
});

// Start server AFTER MongoDB connects
client.connect()
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(PORT, () => {
            console.log("🚀 Server is running on port " + PORT);
        });
    })
    .catch(err => {
        console.error("❌ Failed to connect to MongoDB", err);
        process.exit(1);
    });
