import { LikesService } from '../services/likes.service';
import { asyncHandler } from '../middlewares/asyncHandlerMW';
import { AuthenticatedRequest } from '../interfaces/authentication.interface';
import { NextFunction, Response } from 'express';
import { LikeData, LikesSanitize } from '../interfaces/likes.interface';
import APIError from '../utils/apiError';

export class LikesController {
    private likesService: LikesService;
    constructor() {
        this.likesService = new LikesService()
    }

    addOrDeleteLike = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const likeData: LikeData = {
                postId: req.params.postId,
                userId: req.user._id as string
            }

            const addLike: LikesSanitize = await this.likesService.addOrDeleteLike(likeData);
            if (!addLike) return next(new APIError("Can't add your like", 400));
            res.json({ status: "Success", Fans: addLike });
        }
    })
}