import request, { Response } from "supertest";
import { expect } from "chai";

import { app } from "../index";

const server = request(app);

const userData = {
  _id: "64723339b04e93f902f60c9d",
  email: "fortest@gmail.com",
  password: "123456Aa@",
};
const post = {
  post: "This post for testing",
  postType: "friends",
};
const updatePost = {
  post: "This post for testing updated",
};

describe("Post Testing", () => {
  let token: string | undefined;
  before(async () => {
    const res: Response = await server
      .post("/api/v1/auth/login")
      .send(userData);
    token = res.body.token;
  });

  describe("POST /api/v1/posts", () => {
    it("should create post", async () => {
      const res = await server
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(post);

      expect(res.body.status).to.be.equal("Success");
      expect(res.body).have.property("post");
      expect(res.status).to.be.equal(201);
    });

    it("should not create post if user not login", async () => {
      const res = await server.post("/api/v1/posts").send(post);

      expect(res.status).to.be.equal(401);
    });
  });

  describe("GET /api/v1/posts", () => {
    it("should Get Friends posts", async () => {
      const res = await server
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(post);

      expect(res.body.status).to.be.equal("Success");
      expect(res.body).have.property("post");
      expect(res.status).to.be.equal(201);
    });

    it("should not create post if user not login", async () => {
      const res = await server.post("/api/v1/posts").send(post);

      expect(res.status).to.be.equal(401);
    });
  });

  describe("PATCH /api/v1/posts/:id", () => {
    it("should update post", async () => {
      const res = await server
        .patch("/api/v1/posts/6473b4f47fbe5776f8db2f00")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePost);

      expect(res.body.status).to.be.equal("Success");
      expect(res.body).have.property("post");
      expect(res.status).to.be.equal(200);
    });

    it("should not updated post if post id not exist", async () => {
      const res = await server
        .patch("/api/v1/posts/6473b4f47fbe5776f8db2f01")
        .set("Authorization", `Bearer ${token}`)
        .send(updatePost);

      expect(res.status).to.be.equal(400);
    });
  });

  describe("Delete /api/v1/posts/:id", () => {
    it("should delete post", async () => {
      const res = await server
        .delete("/api/v1/posts/6473b4f47fbe5776f8db2f00")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(204);
    });

    it("should not Deleted post if user not owner of post", async () => {
      const res = await server
        .delete("/api/v1/posts/6473b4f47fbe5776f8db2f01")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(400);
    });
  });

  describe("POST /api/v1/posts/share/:sharePostId", () => {
    it("should share post", async () => {
      const res = await server
        .post("/api/v1/posts/share/649273ace01654476dc41f9c")
        .set("Authorization", `Bearer ${token}`)
        .send(post);

      expect(res.status).to.be.equal(201);
    });

    it("should not share post if post not exist", async () => {
      const res = await server
        .post("/api/v1/posts/share/6473b4f47fbe5776f8db2f01")
        .set("Authorization", `Bearer ${token}`)
        .send(post);

      expect(res.status).to.be.equal(404);
    });
  });

  describe("GET /api/v1/posts/memories", () => {
    it("Get posts Created on the same day", async () => {
      const res = await server
        .get("/api/v1/posts/memories")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(200);
    });
  });
});
