const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
// const socketIO = require('socket.io');
const http = require("http");

const path = require("path");

const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
// const contacts = require('./routes/api/contacts');
const schools = require("./routes/api/schools");
const majors = require("./routes/api/majors");
const courses = require("./routes/api/courses");
const quizzes = require("./routes/api/quizzes");

const app = express();
var server = http.createServer(app);

// Socket Management
// var io = socketIO(server);
// module.exports = { io };

// const SocketManager = require('./SocketManager');
// io.on('connection', SocketManager);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/uploads', express.static('uploads'));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB error: ", err);
  });

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/schools", schools);
app.use("/api/majors", majors);
app.use("/api/courses", courses);
app.use("/api/quizzes", quizzes);

// @route GET api/getapiversion
// @desc Get API version
// @access Public
app.get("/api/getapiversion", (req, res) => {
  res.json("1.0.4");
});

if (process.env.NODE_ENV === "production") {
  // console.log("production mode");
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")));
} else {
  app.get("/", (req, res) => {
    res.send("Quiza API is running");
  });
}

const port = process.env.PORT || 5002;
// app.listen(port, () => {
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
