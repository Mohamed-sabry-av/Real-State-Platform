const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db.config");
const app = express();

// Middleware & Connect
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
const PostRoute = require("./src/routes/post.route");
const authRoute = require("./src/routes/auth.route")
const testRoute = require("./src/routes/test.route")
const userRoute = require("./src/routes/user.route")

app.use("/post/", PostRoute);
app.use("/auth", authRoute);
app.use("/test", testRoute);
app.use("/user/",userRoute)

// Root route
// app.get("/", (req, res) => {
//   res.status(200).send("Welcome to Engineering Platform API");
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
