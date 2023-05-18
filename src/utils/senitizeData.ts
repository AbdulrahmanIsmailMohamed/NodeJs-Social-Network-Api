import { PostInterface } from "../interfaces/post.interface";
import UserInterface from "../interfaces/user.Interface";

class SenitizeData {
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