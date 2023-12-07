import { errorHandling } from "../utils/errorHandling";
import Post from "../models/Post";
import { LikeData } from "../interfaces/likes.interface";
import APIError from "../utils/apiError";
import { IPost } from "interfaces/post.interface";

export class LikesService {
  addOrDeleteLike = async (likeData: LikeData): Promise<IPost> => {
    const { postId, userId } = likeData;

    const isUserAddedALike = await errorHandling(
      Post.exists({ fans: userId }).exec()
    );

    let updateQuery;
    if (!isUserAddedALike) {
      updateQuery = {
        $inc: { likes: 1 },
        $addToSet: { fans: userId },
      };
    } else {
      updateQuery = {
        $inc: { likes: -1 },
        $pull: { fans: userId },
      };
    }

    const updatedPost = await errorHandling(
      Post.findByIdAndUpdate(postId, updateQuery, { new: true })
        .select("fans likes")
        .populate("fans", "name profileImage")
        .exec()
    );

    if (!updatedPost) throw new APIError("Post Not Found!!", 404);
    return updatedPost;
  };

  getFans = async (postId: string): Promise<IPost> => {
    const fans = await errorHandling(
      Post.findById(postId)
        .select("fans likes")
        .populate("fans", "name profileImage")
        .exec()
    );

    if (!fans) throw new APIError("Can't find post", 404);
    return fans;
  };
}
