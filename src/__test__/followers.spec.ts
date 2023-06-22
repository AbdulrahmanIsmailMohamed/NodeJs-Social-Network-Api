import request, { Response } from "supertest";
import { expect } from "chai";

import { app } from "../index";

const server = request(app);

const userData = {
    _id: "64723339b04e93f902f60c9d",
    email: "fortest@gmail.com",
    password: "123456Aa@",
}
const followUserData = {
    _id: "6487cf80b961ade5c8d57619",
    email: "user4@gmail.com"
}

describe("Post Testing", () => {
    let token: string | undefined;
    before(async () => {
        const res: Response = await server.post("/api/v1/auth/login").send(userData)
        token = res.body.token;
    });

    describe("POST api/v1/followers/:id", () => {
        it("should follow user", async () => {
            const res = await server.post(`/api/v1/followers/${followUserData._id}`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200)
        });
    });
   
    describe("GET api/v1/followers/:id", () => {
        it("should get list follow user", async () => {
            const res = await server.get(`/api/v1/followers/${followUserData._id}`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200)
        });
       
        it("should get list follow logged user", async () => {
            const res = await server.get(`/api/v1/followers`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200)
        });
    });
   
    describe("POST api/v1/followers/:id", () => {
        it("should delete follow from user list", async () => {
            const res = await server.delete(`/api/v1/followers/${followUserData._id}`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200)
        });
    });

});