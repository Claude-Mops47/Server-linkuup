// import cors from "cors";
// import dotenv from "dotenv";
// import morgan from "morgan";
// import express from "express";
// import connectDB from "./db/connect.js";
// import authRoute from "./routes/authRoute.js";
// import appointmentRoute from "./routes/appointmentRoute.js";
// import session from "express-session";
// import helmet from "helmet";
// import cookieParser from "cookie-parser";
// import cacheController from 'express-cache-controller';

// const app = express();
// dotenv.config();

// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({origin:'http://192.168.100.5:5000', credentials:true}));
// app.use(cookieParser())
// app.use(cacheController());

// app.use(helmet());

// app.use(
//   session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 3600000 },
//   })
// );
// app.use((req, res, next) => {
//   const allowedOrigins = ["http://localhost:3000", "http://192.168.100.5:3000"];
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// // app.use((req, res, next) => {
// //   res.setHeader("Access-Control-Allow-Origin", "*");
// //   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
// //   next();
// // });

// app.use("/users", authRoute);
// app.use("/appointments", appointmentRoute);

// app.get("/", (req, res) => {
//   res.json({ message: "Here" });
// });

// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({message:'Erreur interne du serveur'});
// });

// const port = process.env.PORT || 5004;

// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URL);
//     console.log("DATABASE CONNECTED");
//   } catch (error) {
//     console.log("DATABASE CONNECTION ERROR", error);
//     process.exit(1);
//   }
//   app.listen(port, () => {
//     console.log(`SERVER RUNNING ON PORT: ${port}`);
//   });
// };

// start();

import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import connectDB from "./db/connect.js";
import authRoute from "./routes/authRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import session from "express-session";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cacheController from "express-cache-controller";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cacheController());

app.use(helmet());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  })
);

// Configuration personnalisée pour CORS
const corsOptions = {
  // origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: "Content-Type,Authorization, x-refresh-token",
  origin: [
    "http://localhost:3000",
    "http://192.168.100.2:3000",
    "http://192.168.100.5:3000",
    "http://192.168.100.6:3000",
    "http://192.168.100.7:3000",
    "http://192.168.100.8:3000",
    "http://192.168.100.9:3000",
    "http://192.168.100.12:3000",
    "http://192.168.100.13:3000",
    "http://192.168.100.14:3000",
    "http://192.168.100.15:3000",
    "http://192.168.100.16:3000",
    "http://192.168.100.22:3000",
    "http://192.168.100.24:3000",
  ],
};

app.use(cors(corsOptions));

app.use("/users", authRoute);
app.use("/appointments", appointmentRoute);

app.get("/", (req, res) => {
  res.json({ message: "Here" });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur interne du serveur" });
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
