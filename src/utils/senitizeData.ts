import { PostInterface } from "../interfaces/post.interface";
import UserInterface from "../interfaces/user.Interface";

class SenitizeData {
    userLogin = (user: UserInterface) => (
        {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }
    );
    userRegister = (user: UserInterface) => (
        {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            number: user.number,
            address: user.address,
        }
    );
    friends = (user: UserInterface) => (
        {
            _id: user._id,
            friends: user.friends
        }
    );
    post = (post: PostInterface) => (
        {
            _id: post._id,
            userId: post.userId,
            post: post.post,
            postType: post.postType,
            image: post.image,
            likes: post.likes,
            share: post.share
        }
    )
}

export default SenitizeData;