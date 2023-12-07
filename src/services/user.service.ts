import { IUser, UpdateLoggedUser } from "../interfaces/user.Interface";
import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import { APIFeature } from "../utils/apiFeature";
import APIError from "../utils/apiError";
import { Features } from "../interfaces/post.interface";
import cloudinary from "../config/coludinaryConfig";

class UserService {
  updateLoggedUser = async (userBody: UpdateLoggedUser): Promise<IUser> => {
    const { name, address, number, userId, imagePath, city } = userBody;

    const user = await errorHandling(
      User.findOneAndUpdate(
        { _id: userId, active: true },
        {
          name,
          address,
          number,
          city,
        },
        { new: true }
      )
        .select("name profileImage profileImages address")
        .exec()
    );
    if (!user) throw new APIError("User not found", 404);

    if (imagePath) {
      const result = await errorHandling(
        cloudinary.uploader.upload(imagePath, {
          folder: "uploads/profileImages",
          format: "jpg",
          public_id: `${Date.now()}-profile`,
        })
      );
      if (!result) throw new APIError("Internal Server Error", 500);
      user.profileImage = result.url;
      user.profileImages
        ? user.profileImages.push(result.url)
        : console.log("Profile images is null");
      await user.save();
    }

    if (!user) throw new APIError("Can't update your data", 400);
    return user;
  };

  inActiveLoggedUser = async (userId: string): Promise<string> => {
    const user = await errorHandling(
      User.findOneAndUpdate({ _id: userId }, { active: false }).exec()
    );
    if (!user) throw new APIError("Can't inactive this user", 400);
    return "Your profile is inactive";
  };

  /** @access admin */
  getUsers = async (features: Features) => {
    const countDocument = await errorHandling(
      User.countDocuments({ active: true }).exec()
    );

    const apiFeature = new APIFeature(User.find({ active: true }), features)
      .search()
      .pagination(countDocument);

    const result = await errorHandling(apiFeature.execute("users"));
    if (!result) throw new APIError("can't find users", 404);
    return result;
  };

  getUser = async (userId: string): Promise<IUser> => {
    const user = await errorHandling(
      User.findOne({ _id: userId, active: true })
        .select("name profileImage address")
        .exec()
    );

    if (!user) throw new APIError("can't find this user", 404);
    return user;
  };
}

export default UserService;
