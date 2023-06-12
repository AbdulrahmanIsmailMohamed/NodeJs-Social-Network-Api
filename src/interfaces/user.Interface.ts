import { Document, ObjectId } from "mongoose"

export interface IUser {
    name: string,
    number: string,
    email: string,
    password: string,
    _id?: string
    isAdmin?: boolean,
    limitFriends?: number,
    limitFriendshipRequest?: number,
    address?: string,
    friends?: Array<ObjectId>,
    profileImage?: string,
    profileImages?: Array<string>,
    myFriendshipRequests?: Array<ObjectId>,
    friendshipRequests?: Array<ObjectId>,
    favourites?: Array<Object>
    hideUserPosts?: Array<ObjectId>
    active?: boolean
}

export interface UpdateLoggedUser {
    userId: string,
    name: string,
    address: string,
    number: string,
    imagePath?: string | undefined
}

export interface GetUser extends UpdateLoggedUser, Document {
    profileImage: string,
    profileImages: Array<string>,
}

export interface UserId { _id: string; active: boolean; friends: string[] }