import request from "supertest";
import { expect } from "chai";

import { app } from "../index";

const userData = {
    email: "fortest@gmail.com",
    password: "123456Aa@",
}

const server = request(app);
describe("User Testing", () => {
    let token: string | undefined;
    before(async () => {
        const res = await server.post("/api/v1/auth/login").send(userData)
        token = res.body.token;
    });

    describe("GET api/v1/friends", () => {
        it("should get frineds logged user", async () => {
            const res = await server.get("/api/v1/friends")
                .set("Authorization", `Bearer ${token}`);

            expect(res.body.status).to.be.equal("Success");
            expect(res.status).to.be.equal(200);
        });

        it("should not get frineds logged user, if not login", async () => {
            const res = await server.get("/api/v1/friends")

            expect(res.body.status).to.be.equal(401)
            expect(res.body.message).to.be.equal('Please login to access this route')
        });
    });

    describe("GET api/v1/friends/:id", () => {
        it("should get frineds user id", async () => {
            const res = await server.get("/api/v1/friends/64720c5bc99745d73c8fea76")
                .set("Authorization", `Bearer ${token}`);

            expect(res.body.status).to.be.equal("Success");
            expect(res.status).to.be.equal(200);
        });

        it("should not get frineds user if id not exist", async () => {
            const res = await server.get("/api/v1/friends/64720c5bc99745d73c8fed76")
                .set("Authorization", `Bearer ${token}`);

            expect(res.body.status).have.undefined;
            expect(res.status).to.be.equal(400);
        });
    });

    describe("PATCH api/v1/friends/:id", () => {
        it("should send frined request to user", async () => {
            const res = await server.patch("/api/v1/friends/647205f9dbe359815c9747f7")
                .set("Authorization", `Bearer ${token}`);

            expect(res.body.status).to.be.equal("Success");
            expect(res.body.message).to.be.equal("Friendship request sent");
            expect(res.status).to.be.equal(200);
        });

        it("should not send friend request if user not login", async () => {
            const res = await server.patch("/api/v1/friends/647205f9dbe359815c9747f8")

            console.log(res.body);

            expect(res.body.status).to.be.equal(401)
            expect(res.body.message).to.be.equal('Please login to access this route')
        });
    });
});