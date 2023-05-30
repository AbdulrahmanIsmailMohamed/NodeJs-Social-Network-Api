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
    myFriendshipRequests?: Array<object>,
    friendshipRequests?: Array<object>,
    active?: boolean
}

export interface UpdateLoggedUser {
    userId: string,
    name: string,
    address: string,
    number: string,
}

export interface GetUser extends UpdateLoggedUser {
    profileImage: string,
} 