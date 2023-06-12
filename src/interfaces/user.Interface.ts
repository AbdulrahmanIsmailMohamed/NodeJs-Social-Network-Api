import { Document } from "mongoose"

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
    friends?: Array<object>,
    profileImage?: string,
    profileImages?: Array<string>,
    myFriendshipRequests?: Array<object>,
    friendshipRequests?: Array<object>,
    favourites?: Array<Object>
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