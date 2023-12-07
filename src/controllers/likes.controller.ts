import { LikesService } from "../services/likes.service";
import { asyncHandler } from "../middlewares/asyncHandlerMW";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import { NextFunction, Response } from "express";
import { LikeData } from "../interfaces/likes.interface";
import APIError from "../utils/apiError";

export class LikesController {
  private likesService: LikesService;
  constructor() {
    this.likesService = new LikesService();
  }

  addOrDeleteLike = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const likeData: LikeData = {
          postId: req.params.postId,
          userId: req.user._id as string,
        };

        const addLike = await this.likesService.addOrDeleteLike(likeData);
        if (!addLike) return next(new APIError("Can't add your like", 400));
        res.json({ status: "Success", Fans: addLike });
      }
    }
  );

  getFans = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const postId = req.params.postId as string;

      const fans = await this.likesService.getFans(postId);
      if (!fans) return next(new APIError("Can't find post", 404));
      res.status(200).json(fans);
    }
  );
}
