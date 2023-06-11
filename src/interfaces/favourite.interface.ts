export interface FavouriteData {
    userId: string,
    postId: string
}

export interface FavouritesSanitize {
    name: string,
    profileImage: Array<string>,
    favourites: Array<string>
}