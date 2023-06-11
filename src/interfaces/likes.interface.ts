export interface LikeData {
    userId: string,
    postId: string
}

interface Fans {
    name: string,
    profileImage: string
}
export interface LikesSanitize {
    fans: Array<Fans>
    likes: number
}
