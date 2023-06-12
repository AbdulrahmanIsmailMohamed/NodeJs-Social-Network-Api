import { Document } from "mongoose"

export interface IUser {
    name: string,
    number: string,
    email: string,
    password: string,
    numberOfFollowers: number,
    _id?: string
    isAdmin?: boolean,
    limitFriends?: number,
    limitFriendshipRequest?: number,
    address?: string,
    friends?: Array<string>,
    followers?: Array<string>,
    followUsers?: Array<string>,
    unFollowUsers?: Array<string>,
    profileImage?: string,
    profileImages?: Array<string>,
    myFriendshipRequests?: Array<string>,
    friendshipRequests?: Array<string>,
    favourites?: Array<Object>
    hideUserPosts?: Array<string>
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