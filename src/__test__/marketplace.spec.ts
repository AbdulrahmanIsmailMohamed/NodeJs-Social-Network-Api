import request, { Response } from "supertest";
import { expect } from "chai";

import { app } from "../index";
import { ItemForSaleBody } from "../interfaces/marketplace.interface";

const server = request(app);

const userData = {
    _id: "64723339b04e93f902f60c9d",
    email: "fortest@gmail.com",
    password: "123456Aa@"
}

const ItemForSale = {
    _id: "6493c88d4a3489982e48639f",
    // address: "zagazig, egypt",
    // availability: "View As Available",
    // category: "product",
    // condition: "New",
    // price: 1500,
    // site: "zagazig",
    description: "this is product for testing",
    // image: "images.jpeg"
}

describe("Post Testing", () => {
    let token: string | undefined;
    before(async () => {
        const res: Response = await server.post("/api/v1/auth/login").send(userData)
        token = res.body.token;
    });

    describe("POST /api/v1/marketplaces", () => {
        it("Should not create item for sale if body not contains on images", async () => {
            const res = await server.post("/api/v1/marketplaces")
                .set("Authorization", `Bearer ${token}`)
                .send(ItemForSale)

            expect(res.status).to.be.equal(400);
        });
    });

    describe("GET /api/v1/marketplaces", () => {
        it("Should Get items for sale", async () => {
            const res = await server.get("/api/v1/marketplaces")
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200);
        });
    });

    describe("PATCH /api/v1/marketplaces/:id", () => {
        it("Should Update items for sale", async () => {
            const res = await server.patch(`/api/v1/marketplaces/${ItemForSale._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(ItemForSale)

            expect(res.status).to.be.equal(200);
        });
    });

    describe("DELETE /api/v1/marketplaces/:id", () => {
        it("Should Delete User items for sale", async () => {
            const res = await server.delete(`/api/v1/marketplaces/${ItemForSale._id}`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(204);
        });
    });

    describe("GET /api/v1/marketplaces/me", () => {
        it("Should Get loggedUser items for sale", async () => {
            const res = await server.get("/api/v1/marketplaces/me")
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200);
        });

        it("Should  not Get loggedUser items for sale, if not login", async () => {
            const res = await server.get("/api/v1/marketplaces/me")

            expect(res.status).to.be.equal(401);
        });
    });

    describe("PATCH /api/v1/marketplaces/me/:id", () => {
        it("Should unAvailable loggedUser items for sale", async () => {
            const res = await server.get(`/api/v1/marketplaces/me/${ItemForSale._id}`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.status).to.be.equal(200);
        });
    });


});