import { PostSanitize } from "../interfaces/post.interface";
import { CommentsInterface } from "../interfaces/comments.interface";
import UserInterface from "../interfaces/user.Interface";

class SanitizeData {
    userLogin = (user: UserInterface) => (
        {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
    );

    user = (user: UserInterface) => (
        {
            _id: user._id,
            name: user.name,
            profileImage: user.profileImage,
            friends: user.friends,
            address: user.address
        }
    )

    userRegister = (user: UserInterface) => (
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            number: user.number,
            address: user.address,
        }
    );

    post = (post: PostSanitize) => (
        {
            _id: post._id,
            userId: post.userId,
            post: post.post,
            postType: post.postType,
            image: post.image,
            likes: post.likes,
            share: post.share
        }
    );

    comments = (comment: CommentsInterface) => (
        {
            _id: comment._id,
            userId: comment.userId,
            postId: comment.postId,
            comment: comment.comment,
            image: comment.image,
            likes: comment.likes,
            reply: comment.reply
        }
    )
}

export default SanitizeData;