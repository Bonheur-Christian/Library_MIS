require("dotenv").config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
// const NovelRoute = require("./routes/NovelRoute");
const UserRoute = require('./routes/UserRoute');
const CourseBook = require('./routes/CourseBookRoute')
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))
app.use(cors());

// app.use("/api/novels", NovelRoute);
app.use("/api/user", UserRoute);
app.use("/api/course-books/", CourseBook);


const port = 3001;

app.listen(port, () => {
    console.log("Server is running on port " + port);

})