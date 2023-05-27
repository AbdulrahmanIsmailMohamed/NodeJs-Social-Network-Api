import { expect } from "chai";
import request from "supertest";
import { app } from "../index";

const server = request(app);

const newUserData = {
    name: "test name",
    email: "fortest@gmail.com",
    password: "123456Aa@",
    confirmPassword: "123456Aa@",
    number: "01553890802"
}

const userData = {
    email: "user3@gmail.com",
    password: "123456Aa@"
}

const fakeUserData = {
    email: "user3555@gmail.com",
    password: "123456Aa@"
}

describe("Authentication", () => {
    describe("POST api/v1/auth/login", () => {
        it("should retun success and token if login successfully", async () => {
            const res = await server.post("/api/v1/auth/login")
                .send(userData)

            expect(res.status).to.equal(201)
            expect(res.body.status).to.equal("Success")
            expect(res.body.token).not.undefined
        });

        it("should retun undefined if login failed", async () => {
            const res = await server.post("/api/v1/auth/login")
                .send(fakeUserData)

            expect(res.status).to.equal(400);
        });
    })

    describe("POST api/v1/auth/register", () => {
        it("should retun success and token if register successfully", async () => {
            const res = await server.post("/api/v1/auth/register")
                .send(newUserData)

            expect(res.body.status).to.equal("Success")
            expect(res.body.token).not.undefined
        });

        it("should retun undefined if register failed", async () => {
            const res = await server.post("/api/v1/auth/register")
                .send(newUserData)

            expect(res.status).to.equal(400);
        });
    })
})