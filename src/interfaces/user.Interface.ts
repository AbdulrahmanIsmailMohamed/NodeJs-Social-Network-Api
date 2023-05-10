import { Document } from "mongoose";

interface UserInterface extends Document {
    firstName: string,
    lastName: string,
    address?: string,
    number: string,
    profileImage?: string,
    email: string,
    password: string,
    friends?: Array<object>,
    friendsRequest?: Array<object>
}

export default UserInterface;