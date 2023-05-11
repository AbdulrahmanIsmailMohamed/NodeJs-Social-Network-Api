import express, { Application, NextFunction, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connect";
import { errorHandling } from "./middlewares/errorHandlingMW";
import { mounter } from "./routes";
import { morganStream } from "./logger";
import APIError from "./utils/apiError";

const app: Application = express();
const PORT = process.env.PORT || 3000;
const API = process.env.API;

// cors
app.use(cors())
app.options('*', cors()); // include before other routes

// compression
app.use(compression());

// middleware
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.json({ limit: "20kb" }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("tiny", { stream: morganStream }));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// routes
mounter(API, app);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new APIError(`Can't Find This Route ${req.originalUrl}!!`, 404));
});

// Glopal error Handling in express
app.use(errorHandling);

// connectDB And start server
connectDB();
const server = app.listen(PORT, () => {
    console.log(`link: http://localhost:${PORT}/${API}`);
    console.log(`The Server Runnig On Port : ${PORT}`);
});

// error handling that event out express
process.on("unhandledRejection", (err: Error) => {
    console.log({
        unhandledRejection: true,
        nameError: `${err.name} `,
        message: `${err.message}`,
        stack: `${err.stack}`
    });
    server.close(() => {
        console.log("Server Shut Down....");
        process.exit(1);
    });
});

// Handling synchronous exciption
process.on("uncaughtException", (err) => {
    console.log({
        unhandlingException: true,
        nameError: `${err.name} `,
        message: `${err.message}`,
        stack: `${err.stack}`
    });
});