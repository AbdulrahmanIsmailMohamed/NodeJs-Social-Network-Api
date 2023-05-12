import { Application } from "express";
import usersRoute from "./user.routes";
import authRoute from "./auth.routes";
import friendsRoute from "./friends.routes";

export const mounter = (API: String, app: Application) => {
    app.use(`${API}/users`, usersRoute);
    app.use(`${API}/auth`, authRoute);
    app.use(`${API}/friends`, friendsRoute);
}