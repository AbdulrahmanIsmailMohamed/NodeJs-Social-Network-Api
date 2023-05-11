import { Request } from "express";

import UserInterface from "./user.Interface";

interface AuthenticatedRequest extends Request {
    user?: UserInterface
}

export default AuthenticatedRequest;