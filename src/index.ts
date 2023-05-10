import express, { Application, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connect";
import userRouter from "./routes/user.routes";

const app: Application = express();

// cors
app.use(cors())
app.options('*', cors()); // include before other routes

// compression
app.use(compression());

// middleware
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.json({ limit: "20kb" }));
if (process.env.NODE_ENV === "development") {
    app.use(morgan("tiny"));
}

// routes
app.use("/users", userRouter)

// connect
connectDB()
app.listen(3000, () => console.log("The Server"));