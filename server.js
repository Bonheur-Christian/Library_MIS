require("dotenv").config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const connectToMongo = require('./model/config'); // Mongoose DB connection
const UserRoute = require('./routes/UserRoute');
const CourseBook = require('./routes/BookRoute');

const app = express();
const PORT = 3001;

app.set('trust proxy', 1);

const allowedOrigins = [
  'https://library-mis.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

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

app.use("/api/user", UserRoute);
app.use("/api/books", CourseBook);

app.get('/', (req, res) => {
  res.send("Library API is live and connected to MongoDB!");
});

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
