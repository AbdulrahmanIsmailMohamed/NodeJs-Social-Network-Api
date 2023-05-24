import request from "supertest";

import { app } from '../index';
import UserController from '../controllers/user.controller';
import UserService from '../services/user.service';
import APIError from '../utils/apiError';
import { NextFunction, Request, Response } from "express";

jest.mock("express");
jest.mock("../services/user.service");

interface AuthRequest extends Request {
    user: {
        _id: string
    }
}

describe("UserController", () => {
    let userController: UserController;
    let userService: UserService;
    let req: AuthRequest;
    let res: Response;
    let next: NextFunction

    beforeAll(() => {
        userService = new UserService();
        userController = new UserController();
        req = {} as AuthRequest;
        res = {} as Response;
        next = jest.fn() as NextFunction;

        // app.use("/",)
    });

    // describe("Update Logged User", () => {
    //     it("should update the logged user and return success", async () => {
    //         const updateLoggedUserMock = jest.spyOn(userService, "updateLoggedUser").mockResolvedValue({})

    //         req.body = {
    //             name: "bebo",
    //             address: "zagazigo",
    //             number: "01553890801"
    //         }
    //         req.user = {
    //             _id: "6467b6179cf734dfa5a2feb7",
    //             // name: "BeBo",
    //             // number: "01553890802",
    //             // email: "bebo@gmail.com",
    //             // address: "zag",
    //             // password: "000001AAa"
    //         }

    //         const response = await request(app).patch("/").send(req.body).expect(200);

    //         expect(updateLoggedUserMock).toHaveBeenCalledWith(req.body, req.user._id);
    //         expect(response.body).toEqual({ status: "Success", user: {} });
    //     });
    // })

    it("should get user by id", async () => {
        // Mock the authentication process
        

        const req = await request(app)
            .get("api/v1/users/6464ddee769bc4cbf86fe8fc")
        expect(req.status).toBe(200)
        console.log(req);

    })
})