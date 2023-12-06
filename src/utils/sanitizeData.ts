import { PostSanitize } from "../interfaces/post.interface";

class SanitizeData {
  post = (post: PostSanitize) => ({
    _id: post._id,
    userId: post.userId,
    post: post.post,
    postType: post.postType,
    medias: post.media,
    likes: post.likes,
    share: post.share,
  });
}

export default SanitizeData;
