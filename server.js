import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import connectDB from "./db/connect.js";
import authRoute from "./routes/authRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import session from "express-session";
import parseurl from "parseurl";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }
  var pathname = parseurl(req).pathname;
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
  next();
});

app.get("/foo", function (req, res, next) {
  res.send("you viewed this page " + req.session.views["/foo"] + " times");
});

app.get("/bar", function (req, res, next) {
  res.send("you viewed this page " + req.session.views["/bar"] + " times");
});

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
