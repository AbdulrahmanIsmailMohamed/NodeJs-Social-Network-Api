import request, { Response } from "supertest";
import { expect } from "chai";

import { app } from "../index";

const server = request(app);

const userData = {
    _id: "64723339b04e93f902f60c9d",
    email: "fortest@gmail.com",
    password: "123456Aa@",
    postId: "6473b459ebf94c9dbfa6fbd0"
}

describe("Post Testing", () => {
    let token: string | undefined;
    before(async () => {
        const res: Response = await server.post("/api/v1/auth/login").send(userData)
        token = res.body.token;
    });

    describe("POST api/v1/likes/:postId", () => {
        it("should add or delete like", async () => {
            const res = await server.post(`/api/v1/likes/${userData.postId}`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200)
        });
    });

    describe("GET api/v1/likes/:postId", () => {
        it("should get fans of post", async () => {
            const res = await server.get(`/api/v1/likes/${userData.postId}`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200)
        });
    });

});