import { FavouriteData, FavouritesSanitize } from '../interfaces/favourite.interface';
import { errorHandling } from '../utils/errorHandling';
import User from '../models/User';
import APIError from '../utils/apiError';

export class FavouriteService {
    addFavourite = async (favouriteData: FavouriteData) => {
        const { postId, userId } = favouriteData;

        const addFavourite = await errorHandling(
            User.findByIdAndUpdate(
                userId,
                { $addToSet: { favourites: postId } },
                { new: true }
            ).select("name profileImage favourites")
        ) as FavouritesSanitize;
        if (!addFavourite) throw new APIError("Your Data not exist", 404);
        return addFavourite
    }

    deleteFavourite = async (favouriteData: FavouriteData) => {
        const { postId, userId } = favouriteData;

        const deleteFavourite = await errorHandling(
            User.findByIdAndUpdate(
                userId,
                { $pull: { favourites: postId } },
                { new: true }
            ).select("name profileImage favourites")
        ) as FavouritesSanitize;
        if (!deleteFavourite) throw new APIError("Your Data not exist", 404);
        return deleteFavourite
    }

    favourites = async (userId: string) => {
        const favourites = await errorHandling(
            User.findById(userId).select("name profileImage favourites")
        ) as FavouritesSanitize;
        if (!favourites) throw new APIError("Your Data not exist", 404);
        return favourites;
    }

}