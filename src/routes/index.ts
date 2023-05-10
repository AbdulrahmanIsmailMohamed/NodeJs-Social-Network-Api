import { Application } from "express";
import userRoute from "./user.routes";

export const mounter = (API: String, app: Application) => {
    app.use(`${API}/users`, userRoute);
}