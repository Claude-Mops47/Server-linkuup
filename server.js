import express from "express";
const app = express();

// dotenv
import dotenv from "dotenv";
dotenv.config();

//db
import connectDB from "./db/connect.js";

// routes
import authRoute from "./routes/authRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import commentRoute from "./routes/commentRoute.js";
import cookieRoute from "./routes/cookieRoute.js";

// morgan
import morgan from "morgan";
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// middleware
import cors from "cors";
// import reteLimiterMiddleware from './middleware/rateLimiter.js'

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.get("/api/back", (req, res) => {
  res.json({ msg: "Here" });
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});
// app.use(reteLimiterMiddleware)
import cookieParser from "cookie-parser";

app.use(cookieParser());

app.use("/api/cookies", cookieRoute);
app.use("/auth", authRoute);
app.use("/api/appoint", appointmentRoute);
app.use("/api/comment", commentRoute);

const port = process.env.PORT || 5004;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.log("DATABASE CONNECTION ERROR", error);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`SERVER RUNNING ON PORT: ${port}`);
  });
};

start();
