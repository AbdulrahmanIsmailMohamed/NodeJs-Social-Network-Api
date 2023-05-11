import { Application } from "express";
import userRoute from "./user.routes";
import authRoute from "./auth.routes";

export const mounter = (API: String, app: Application) => {
    app.use(`${API}/users`, userRoute);
    app.use(`${API}/auth`, authRoute);
}