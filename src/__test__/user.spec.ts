import request from "supertest";

import { app } from "../index";
import { expect } from "chai";

const userData = {
    email: "fortest@gmail.com",
    password: "123456Aa@",
}
const updateLoggedUser = {
    name: "test name",
    address: "test address",
    number: "01553890802"
}

const server = request(app)
describe("User Testing", () => {
    let token: string | undefined;
    before(async () => {
        const res = await server.post("/api/v1/auth/login").send(userData)
        token = res.body.token;
    })

    describe("PATCH api/v1/users", () => {
        it("should update logged user", async () => {
            const res = await server.patch("/api/v1/users")
                .set("Authorization", `Bearer ${token}`)
                .send(updateLoggedUser)

            expect(res.body.status).to.be.equal("Success")
            expect(res.status).to.be.equal(200)
        });

        it("should not update logged user, if token in valid", async () => {
            const res = await server.patch("/api/v1/users")
                .set("Authorization", `Bearer fake token`)
                .send(updateLoggedUser)

            expect(res.body.status).to.be.equal(500)
            expect(res.body.message).to.be.equal("jwt malformed")
        });
    });

    describe("GET api/v1/users/getMe", () => {
        it("should Get Logged User", async () => {
            const res = await server.get("/api/v1/users/getMe")
                .set("Authorization", `Bearer ${token}`);

            expect(res.body.status).to.be.equal("Success")
            expect(res.status).to.be.equal(200)
        });

        it("should not Get Logged User , if not login", async () => {
            const res = await server.patch("/api/v1/users");

            expect(res.body.status).to.be.equal(401)
            expect(res.body.message).to.be.equal('Please login to access this route')
        });
    });

    describe("GET api/v1/users/:id", () => {
        it("should Get User Data by his id", async () => {
            const res = await server.get("/api/v1/users/64720c5bc99745d73c8fea76")
                .set("Authorization", `Bearer ${token}`);

            expect(res.body.status).to.be.equal("Success")
            expect(res.status).to.be.equal(200)
        });

        it("should not Get User Data, if his id not exist", async () => {
            const fakeId = "64723339b04e93f902f60c9y";
            const res = await server.get(`/api/v1/users/${fakeId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.body.status).have.undefined;
            expect(res.status).to.be.equal(400);
        });
    });

    describe("DELETE api/v1/users", () => {
        it("should inactive logged user", async () => {
            const res = await server.delete("/api/v1/users")
                .set("Authorization", `Bearer ${token}`);

            expect(res.body.status).to.be.equal("Success")
            expect(res.status).to.be.equal(200)
        });

        it("should not inactive logged user, if not login", async () => {
            const res = await server.delete(`/api/v1/users`)

            expect(res.body.status).to.be.equal(401);
            expect(res.body.message).to.be.equal('Please login to access this route')
        });
    });


})