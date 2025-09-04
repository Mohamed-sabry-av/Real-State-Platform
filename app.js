const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db.config");
const path = require("path");
const app = express();
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io= socketIO(server,{
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
})

global.io = io;

// Middleware & Connect
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the uploads directory

// Configure CORS before routes
app.use(
  cors({
    origin: ["http://localhost:4200"], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect to MongoDB
connectDB();

// Routes
const PostRoute = require("./src/routes/post.route");
const authRoute = require("./src/routes/auth.route");
const testRoute = require("./src/routes/test.route");
const userRoute = require("./src/routes/user.route");
const chatRoute = require("./src/routes/chat.route");
const messageRoute = require("./src/routes/message.route");

app.use("/post/", PostRoute);
app.use("/auth", authRoute);
app.use("/test", testRoute);
app.use("/user/", userRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

require("./src/socket/socket")(io);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

