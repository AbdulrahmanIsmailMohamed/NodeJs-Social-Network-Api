import { Document, ObjectId } from "mongoose";

interface UserInterface extends Document {
    _id: string
    name: string,
    number: string,
    email: string,
    password: string,
    isAdmin?: boolean,
    limitFriends?: number,
    limitFriendshipRequest?: number,
    address?: string,
    friends?: Array<object>,
    profileImage?: string,
    myFriendshipRequests?: Array<object>,
    friendshipRequests?: Array<object>,
    active?: Boolean
}

export default UserInterface;