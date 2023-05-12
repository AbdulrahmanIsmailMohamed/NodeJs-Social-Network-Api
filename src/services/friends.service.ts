import { errorHandling } from "../utils/errorHandling";
import User from "../models/User";
import APIError from "../utils/apiError";

class FriendsService {
    friendRequest = async (userData: any) => {
        const friendRequest = await errorHandling(
            User.findByIdAndUpdate(
                userData.userId,
                { $addToSet: { friendsRequest: userData.friendRequestId } },
                { new: true }
            )
        );
        if (!friendRequest) throw new APIError("Can't Add fried request id!!", 400);
        return friendRequest;
    }
}

export default FriendsService;