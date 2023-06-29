import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import connectDB from "./db/connect.js";
import authRoute from "./routes/authRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import session from "express-session";
import helmet from "helmet";
import { cacheMiddleware } from "./middleware/cacheMiddlewar.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())

// app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  })
);

// app.use(cacheMiddleware);

app.use("/users", authRoute);
app.use("/appointments", appointmentRoute);

app.get("/", (req, res) => {
  res.json({ message: "Here" });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "not found" });
});

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
