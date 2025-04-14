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

// ✅ Allowed origins
const allowedOrigins = [
  'https://library-mis.vercel.app',
  'http://localhost:3000'
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Preflight OPTIONS handler
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Optional global headers (for stubborn CORS issues)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
