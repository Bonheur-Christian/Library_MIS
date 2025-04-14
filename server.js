require("dotenv").config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const UserRoute = require('./routes/UserRoute');
const CourseBook = require('./routes/BookRoute');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: "http://localhost:3000", 
    origin:"https://library-mis.vercel.app",
    credentials: true               
}));

app.use(express.json());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // use true in production with HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use("/api/user/", UserRoute);
app.use("/api/books/", CourseBook);

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
