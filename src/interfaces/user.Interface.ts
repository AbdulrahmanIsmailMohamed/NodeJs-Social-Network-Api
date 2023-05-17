import { Document, ObjectId } from "mongoose";

interface UserInterface extends Document {
    _id: ObjectId
    firstName: string,
    lastName: string,
    number: string,
    email: string,
    password: string,
    address?: string,
    friends?: Array<object>,
    profileImage?: string,
    myFriendshipRequests?: Array<object>,
    friendshipRequests?: Array<object>,
    active?: Boolean
}

export default UserInterface;