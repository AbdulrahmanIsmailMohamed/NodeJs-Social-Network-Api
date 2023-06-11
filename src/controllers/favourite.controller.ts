import { NextFunction, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandlerMW';
import { AuthenticatedRequest } from '../interfaces/authentication.interface';
import { FavouriteService } from '../services/favourite.service';
import { FavouriteData, FavouritesSanitize } from '../interfaces/favourite.interface';
import APIError from '../utils/apiError';

export class FavouriteController {
    private FavouriteService: FavouriteService;
    constructor() {
        this.FavouriteService = new FavouriteService();
    }

    addFavourite = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const favouriteData: FavouriteData = {
                userId: req.user._id as string,
                postId: req.params.postId
            }

            const addFavourite: FavouritesSanitize = await this.FavouriteService.addFavourite(favouriteData);
            if (!addFavourite) return next(new APIError("Can't Add this post in your favourite", 400));
            res.status(201).json({ status: "Success", Favourite: addFavourite });
        }
        else return next(new APIError("Please login", 401));
    });

    favourites = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const userId: string = req.user._id as string;

            const favourites: FavouritesSanitize = await this.FavouriteService.favourites(userId);
            if (!favourites) return next(new APIError("Can't Add this post in your favourite", 400));
            res.status(200).json({ status: "Success", favourites });
        }
        else return next(new APIError("Please login", 401));
    });

    deleteFavourite = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const favouriteData: FavouriteData = {
                userId: req.user._id as string,
                postId: req.params.postId
            }

            const deleteFavourite: FavouritesSanitize = await this.FavouriteService.deleteFavourite(favouriteData);
            if (!deleteFavourite) return next(new APIError("Can't Add this post in your favourite", 400));
            res.status(200).json({ status: "Success", Favourite: deleteFavourite });
        }
        else return next(new APIError("Please login", 401));
    });

}