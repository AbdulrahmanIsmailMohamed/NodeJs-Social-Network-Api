import request, { Response } from "supertest";
import { expect } from "chai";

import { app } from "../index";

const server = request(app);

const userData = {
    _id: "64723339b04e93f902f60c9d",
    email: "fortest@gmail.com",
    password: "123456Aa@"
}
const comment = {
    comment: "This is comment for testing",
}
const updateComment = {
    comment: "This is comment for testing update",
}

describe("Post Testing", () => {
    let token: string | undefined;
    before(async () => {
        const res: Response = await server.post("/api/v1/auth/login").send(userData)
        token = res.body.token;
    });

    describe("POST /api/v1/comments/:postId", () => {
        it("should create comment", async () => {
            const res = await server.post("/api/v1/comments/6473b459ebf94c9dbfa6fbd0")
                .set("Authorization", `Bearer ${token}`)
                .send(comment)

            expect(res.body.status).to.be.equal("Success");
            expect(res.body).have.property("comment")
            expect(res.status).to.be.equal(201);
        });

        it("should not create comment if user not login", async () => {
            const res = await server.post("/api/v1/comments/6473b459ebf94c9dbfa6fbd0")
                .send(comment)

            expect(res.status).to.be.equal(401)
        });

        it("should not create comment if postId not exist", async () => {
            const res = await server.post("/api/v1/comments/6473b459ebf94c9dbfa6fbd1")
                .set("Authorization", `Bearer ${token}`)
                .send(comment)

            expect(res.status).to.be.equal(400)
        });
    });
    
    describe("GET /api/v1/comments/get/:postId", () => {
        it("should get comments of posts", async () => {
            const res = await server.get("/api/v1/comments/get/6473b459ebf94c9dbfa6fbd0")
                .set("Authorization", `Bearer ${token}`)

            expect(res.body.status).to.be.equal("Success");
            expect(res.status).to.be.equal(200);
        });

        it("should not get comments of post if user not login", async () => {
            const res = await server.post("/api/v1/comments/get/6473b459ebf94c9dbfa6fbd0")

            expect(res.status).to.be.equal(401)
        });
    });

    describe("Get /api/v1/comments/:id", () => {
        it("should create comment", async () => {
            const res = await server.get("/api/v1/comments/647e72b67ae04a8abbd2ef2f")
                .set("Authorization", `Bearer ${token}`)

            expect(res.body.status).to.be.equal("Success");
            expect(res.body).have.property("comment")
            expect(res.status).to.be.equal(200);
        });

        it("should not get comment if comment id not exist", async () => {
            const res = await server.get("/api/v1/comments/6473b459ebf94c9dbfa6fbd1")
                .set("Authorization", `Bearer ${token}`)
                .send(comment)

            expect(res.status).to.be.equal(400)
        });
    });

    describe("PATCH /api/v1/comments/:id", () => {
        it("should update comment", async () => {
            const res = await server.patch("/api/v1/comments/647e72b67ae04a8abbd2ef2f")
                .set("Authorization", `Bearer ${token}`)
                .send(updateComment)

            expect(res.body.status).to.be.equal("Success");
            expect(res.body).have.property("comment")
            expect(res.status).to.be.equal(200);
        });

        it("should not update comment if comment id not exist", async () => {
            const res = await server.get("/api/v1/comments/6473b459ebf94c9dbfa6fbd1")
                .set("Authorization", `Bearer ${token}`)
                .send(updateComment)

            expect(res.status).to.be.equal(400)
        });
    });

    describe("DELETE /api/v1/comments/:id", () => {
        it("should delete comment", async () => {
            const res = await server.delete("/api/v1/comments/647e72b67ae04a8abbd2ef2f")
                .set("Authorization", `Bearer ${token}`)

            expect(res.body.status).to.be.equal("Success");
            expect(res.status).to.be.equal(204);
        });

        it("should not delete comment if comment id not exist", async () => {
            const res = await server.delete("/api/v1/comments/647e72b67ae04a8abbd2ef2f")
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(400)
        });
    });

});