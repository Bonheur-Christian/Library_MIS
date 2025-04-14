require("dotenv").config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const connectToMongo = require('./model/config'); // Mongoose DB connection
const UserRoute = require('./routes/UserRoute');
const CourseBook = require('./routes/BookRoute');

const app = express();
const PORT = 3001;

// ✅ Trust proxy for HTTPS support (important for cookies on Render)
app.set('trust proxy', 1);

app.use(cors({
    origin: 'https://library-mis.vercel.app', // your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// ✅ JSON parser
app.use(express.json());

// ✅ Session setup
app.use(session({
    secret: process.env.SECRET_KEY || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));

// ✅ API Routes
app.use("/api/user", UserRoute);
app.use("/api/books", CourseBook);

// ✅ Health check route
app.get('/', (req, res) => {
    res.send("Library API is live and connected to MongoDB!");
});

// ✅ Start server AFTER DB connection
connectToMongo()
    .then(() => {
        app.listen(PORT, () => {
            console.log("🚀 Server is running on port " + PORT);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB", err);
        process.exit(1);
    });
