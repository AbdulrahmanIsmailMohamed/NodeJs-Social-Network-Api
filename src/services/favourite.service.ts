import {
  FavouriteData,
} from "../interfaces/favourite.interface";
import { errorHandling } from "../utils/errorHandling";
import User from "../models/User";
import APIError from "../utils/apiError";
import { IUser } from "interfaces/user.Interface";

export class FavouriteService {
  addFavourite = async (favouriteData: FavouriteData): Promise<IUser> => {
    const { postId, userId } = favouriteData;

    const addFavourite = await errorHandling(
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { favourites: postId } },
        { new: true }
      )
        .select("name profileImage favourites")
        .exec()
    );
    if (!addFavourite) throw new APIError("Your Data not exist", 404);
    return addFavourite;
  };

  deleteFavourite = async (favouriteData: FavouriteData): Promise<IUser> => {
    const { postId, userId } = favouriteData;

    const deleteFavourite = await errorHandling(
      User.findByIdAndUpdate(
        userId,
        { $pull: { favourites: postId } },
        { new: true }
      )
        .select("name profileImage favourites")
        .exec()
    );
    if (!deleteFavourite) throw new APIError("Your Data not exist", 404);
    return deleteFavourite;
  };

  favourites = async (userId: string): Promise<IUser> => {
    const favourites = await errorHandling(
      User.findById(userId)
        .select("name profileImage favourites")
        .populate({
          path: "favourites",
          select: "post",
          populate: {
            path: "userId",
            select: "name profileImage",
          },
        })
        .exec()
    );
    if (!favourites) throw new APIError("Your Data not exist", 404);
    return favourites;
  };
}
