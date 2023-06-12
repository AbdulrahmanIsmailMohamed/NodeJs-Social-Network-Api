import { errorHandling } from '../utils/errorHandling';
import Post from '../models/Post';
import { LikeData, LikesSanitize } from '../interfaces/likes.interface';
import APIError from '../utils/apiError';

export class LikesService {
    addOrDeleteLike = async (likeData: LikeData): Promise<LikesSanitize> => {
        const { postId, userId } = likeData;

        const isUserAddedALike = await errorHandling(Post.exists({ fans: userId }));

        let updateQuery;
        if (!isUserAddedALike) {
            updateQuery = {
                $inc: { likes: 1 },
                $addToSet: { fans: userId }
            };
        } else {
            updateQuery = {
                $inc: { likes: -1 },
                $pull: { fans: userId }
            };
        }

        const updatedPost = await errorHandling(
            Post.findByIdAndUpdate(postId, updateQuery, { new: true })
                .select("fans likes")
                .populate("fans", "name profileImage")
        ) as LikesSanitize;

        if (!updatedPost) throw new APIError("Post Not Found!!", 404);
        return updatedPost;
    };

    getFans = async (postId: string) => {
        const fans = await errorHandling(
            Post.findById(postId)
                .select("fans likes")
                .populate("fans", "name profileImage")
        ) as LikesSanitize;

        if (!fans) throw new APIError("Can't find post", 404);
        return fans
    }

}