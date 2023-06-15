import { UploadApiResponse } from "cloudinary";

import { GetUser, IUser, UpdateLoggedUser } from "../interfaces/user.Interface";
import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import { APIFeature } from '../utils/apiFeature';
import APIError from '../utils/apiError';
import { Features, GetAPIFeaturesResult } from '../interfaces/post.interface';
import cloudinary from '../config/coludinaryConfig';

class UserService {
    updateLoggedUser = async (userBody: UpdateLoggedUser): Promise<GetUser> => {
        const { name, address, number, userId, imagePath, city } = userBody;

        const user = await errorHandling(
            User.findOneAndUpdate(
                { _id: userId, active: true },
                {
                    name,
                    address,
                    number,
                    city
                },
                { new: true }
            ).select("name profileImage profileImages address")
        ) as GetUser;

        if (imagePath) {
            const result = await (await errorHandling(
                cloudinary.uploader.upload(
                    imagePath,
                    {
                        folder: "uploads/profileImages",
                        format: "jpg",
                        public_id: `${Date.now()}-profile`
                    }
                )
            ) as Promise<UploadApiResponse>);
            if (!result) throw new APIError("Internal Server Error", 500);
            user.profileImage = result.url
            user.profileImages.push(result.url)
            await user.save();
        }

        if (!user) throw new APIError("Can't update your data", 400);
        return user;
    }

    inActiveLoggedUser = async (userId: string): Promise<string> => {
        const user = await errorHandling(
            User.findOneAndUpdate(
                { _id: userId },
                { active: false }
            )) as IUser;
        if (!user) throw new APIError("Can't inactive this user", 400);
        return "Your profile is inactive"
    }

    /** @access admin */
    getUsers = async (features: Features): Promise<GetAPIFeaturesResult> => {
        const countDocument = await errorHandling(User.countDocuments({ active: true })) as number;

        const apiFeature = new APIFeature(User.find({ active: true }), features)
            .search()
            .pagination(countDocument);

        const result = await errorHandling(apiFeature.execute("users")) as GetAPIFeaturesResult;
        if (!result) throw new APIError("can't find users", 404)
        return result
    }

    getUser = async (userId: string): Promise<GetUser> => {
        const user = await errorHandling(
            User.findOne({ _id: userId, active: true })
                .select("name profileImage address")
        ) as GetUser;

        if (!user) throw new APIError("can't find this user", 404);
        return user;
    }
}

export default UserService;