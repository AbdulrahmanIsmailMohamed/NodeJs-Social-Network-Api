import { Document } from "mongoose";

interface UserInterface extends Document {
    firstName: string,
    lastName: string,
    number: string,
    email: string,
    password: string,
    address?: string,
    friends?: Array<object>,
    profileImage?: string,
    friendsRequest?: Array<object>,
    active?:Boolean
}

export default UserInterface;