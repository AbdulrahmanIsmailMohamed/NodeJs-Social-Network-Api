import request, { Response } from "supertest";
import { expect } from "chai";

import { app } from "../index";

const server = request(app);

const userData = {
    _id: "64723339b04e93f902f60c9d",
    email: "fortest@gmail.com",
    password: "123456Aa@"
}
const friendData = {
    _id: "647212fc02d2d5bd5f342772",
    email: "user322ddd22@gmail.com",
    password: "123456Aa@"
}
const post = {
    post: "This post for testing",
    postType: "friends"
}

describe("Post Testing", () => {
    let token: string | undefined;
    before(async () => {
        const res: Response = await server.post("/api/v1/auth/login").send(userData)
        token = res.body.token;
    });

    describe("POST /api/v1/posts", () => {
        it("should create post", async () => {
            const res = await server.post("/api/v1/posts")
                .set("Authorization", `Bearer ${token}`)
                .send(post)

            expect(res.body.status).to.be.equal("Success");
            expect(res.body).have.property("post")
            expect(res.status).to.be.equal(201);
        });

        it("should not create post if user not login", async () => {
            const res = await server.post("/api/v1/posts")
                .send(post)

            expect(res.status).to.be.equal(401)
        });
    })

    describe("GET /api/v1/posts", () => {
        it("should Get Friends posts", async () => {
            const res = await server.post("/api/v1/posts")
                .set("Authorization", `Bearer ${token}`)
                .send(post)

            expect(res.body.status).to.be.equal("Success");
            expect(res.body).have.property("post")
            expect(res.status).to.be.equal(201);
        });

        it("should not create post if user not login", async () => {
            const res = await server.post("/api/v1/posts")
                .send(post)

            expect(res.status).to.be.equal(401)
        });
    })
})