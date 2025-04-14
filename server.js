require("dotenv").config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const connectToMongo = require('./model/config'); // ✅ updated to import mongoose connection
const UserRoute = require('./routes/UserRoute');
const CourseBook = require('./routes/BookRoute');

const app = express();
const PORT = 3001;

// ✅ Define allowed origins
const allowedOrigins = [
  'https://library-mis.vercel.app',
  'http://localhost:3000'
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

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
