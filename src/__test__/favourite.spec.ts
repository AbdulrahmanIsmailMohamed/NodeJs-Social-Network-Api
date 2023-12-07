import request, { Response } from "supertest";
import { expect } from "chai";

import { app } from "../index";

const server = request(app);

const userData = {
  _id: "64723339b04e93f902f60c9d",
  email: "fortest@gmail.com",
  password: "123456Aa@",
  postId: "6473b459ebf94c9dbfa6fbd0",
};

describe("Post Testing", () => {
  let token: string | undefined;
  before(async () => {
    const res: Response = await server
      .post("/api/v1/auth/login")
      .send(userData);
    token = res.body.token;
  });

  describe("POST api/v1/favourites/:postId", () => {
    it("should add post to favourite list", async () => {
      const res = await server
        .post(`/api/v1/favourites/${userData.postId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(201);
    });

    it("should not add post to favourite list if not exist", async () => {
      const res = await server
        .post(`/api/v1/favourites/6493c88d4a3489982e48639f`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(400);
    });
  });

  describe("GET api/v1/favourites", () => {
    it("should get favourites list", async () => {
      const res = await server
        .get(`/api/v1/favourites`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(200);
    });
  });

  describe("Delete api/v1/favourites/:postId", () => {
    it("should delete post from favourite list", async () => {
      const res = await server
        .delete(`/api/v1/favourites/${userData.postId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(200);
    });
  });
});
