import request from "supertest";
import { expect } from "chai";

import { app } from "../index";

const userData = {
  _id: "64723339b04e93f902f60c9d",
  email: "fortest@gmail.com",
  password: "123456Aa@",
};
const friendData = {
  _id: "647212fc02d2d5bd5f342772",
  email: "user322ddd22@gmail.com",
  password: "123456Aa@",
};

const server = request(app);
describe("User Testing", () => {
  let token: string | undefined;
  before(async () => {
    const res = await server.post("/api/v1/auth/login").send(userData);
    token = res.body.token;
  });

  describe("GET api/v1/friends", () => {
    it("should get frineds logged user", async () => {
      const res = await server
        .get("/api/v1/friends")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.status).to.be.equal("Success");
      expect(res.status).to.be.equal(200);
    });

    it("should not get frineds logged user, if not login", async () => {
      const res = await server.get("/api/v1/friends");

      expect(res.body.status).to.be.equal(401);
      expect(res.body.message).to.be.equal("Please login to access this route");
    });
  });

  describe("GET api/v1/friends/:id", () => {
    it("should get frineds user id", async () => {
      const res = await server
        .get("/api/v1/friends/64720c5bc99745d73c8fea76")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.status).to.be.equal("Success");
      expect(res.status).to.be.equal(200);
    });

    it("should not get frineds user if id not exist", async () => {
      const res = await server
        .get("/api/v1/friends/64720c5bc99745d73c8fed76")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.status).have.undefined;
      expect(res.status).to.be.equal(400);
    });
  });

  describe("PATCH api/v1/friends/:id", () => {
    it("should send frined request to user", async () => {
      const res = await server
        .patch(`/api/v1/friends/${friendData._id}`)
        .set("Authorization", `Bearer ${token}`);
      console.log(res.body);

      expect(res.body.status).to.be.equal("Success");
      expect(res.body.message).to.be.equal("Friendship request sent");
      expect(res.status).to.be.equal(200);
    });

    it("should not send friend request if friend id not exist", async () => {
      const res = await server
        .patch(`/api/v1/friends/647205f9dbe359815c9747f8`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(400);
      expect(res.body.Error[0].msg).to.be.equal(
        "This id 647205f9dbe359815c9747f8 not exist"
      );
    });
  });

  describe("GET api/v1/friends/friendsRequest", () => {
    it("should get logged user friendshipRequest", async () => {
      const res = await server
        .get("/api/v1/friends/friendsRequest")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.status).to.be.equal("Success");
      expect(res.status).to.be.equal(200);
    });

    it("should not get logged user friendshipRequest, if user not login", async () => {
      const res = await server.get("/api/v1/friends/friendsRequest");

      expect(res.status).to.be.equal(401);
    });
  });

  describe("GET api/v1/friends/myFriendsRequest", () => {
    it("should get logged user his friendshipRequest", async () => {
      const res = await server
        .get("/api/v1/friends/myFriendsRequest")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.status).to.be.equal("Success");
      expect(res.status).to.be.equal(200);
    });

    it("should not get logged user his friendshipRequest, if user not login", async () => {
      const res = await server.get("/api/v1/friends/myFriendsRequest");

      expect(res.status).to.be.equal(401);
    });
  });

  describe("PATCH api/v1/friends/accept/:id", () => {
    it("should accept friendship Request", async () => {
      // login frind to accept friendship request
      const response = await server
        .post("/api/v1/auth/login")
        .send({ email: friendData.email, password: friendData.password });
      const token: string = response.body.token;

      const res = await server
        .patch(`/api/v1/friends/accept/${userData._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.status).to.be.equal("Success");
      expect(res.status).to.be.equal(200);
    });

    it("should not accept friendship Request, if friend id already accepted", async () => {
      // login frind to accept friendship request
      const response = await server
        .post("/api/v1/auth/login")
        .send({ email: friendData.email, password: friendData.password });
      const token: string = response.body.token;

      const res = await server
        .patch(`/api/v1/friends/accept/${userData._id}`)
        .set("Authorization", `Bearer ${token}`);
      console.log(res.body);

      expect(res.status).to.be.equal(400);
    });
  });

  describe("DELETE api/v1/friends/deleteFriend/:id", () => {
    it("should delete friend by his id", async () => {
      const res = await server
        .delete(`/api/v1/friends/deleteFriend/${friendData._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.status).to.be.equal("Success");
      expect(res.status).to.be.equal(200);
    });

    it("should get error, if friend id not exist in your friends", async () => {
      const res = await server
        .delete(`/api/v1/friends/deleteFriend/${friendData._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.equal(400);
    });
  });
});
