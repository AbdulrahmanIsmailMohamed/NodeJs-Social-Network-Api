export interface FriendRequest {
    userId: string,
    friendId: string
}

export interface FriendshipRequests {
    friendshipRequests: {
        name: string,
        profileImage: string
    }
}

export interface MyFriendshipRequests {
    myFriendshipRequests: {
        name: string,
        profileImage: string
    }
}

export interface Friends {
    friends: {
        name: string,
        profileImage: string
    }
}

export interface FriendsValidator {
    limitFriendshipRequest: number,
    limitFriends: number,
    friends: string[],
    myFriendshipRequests: string[],
    friendshipRequests: string[]
}