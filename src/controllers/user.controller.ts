import { Request, Response } from "express";

import UserService from "../services/user.service";
import { asyncHandler } from '../middlewares/asyncHandler';

class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService()
    }
    createUser = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.createUser(req.body);
        if (!user) return res.status(400).json({ status: "Fail", Message: "The User Not Be Created!" });
        res.status(200).json({ status: "Success", user });
    })
}

export default UserController;