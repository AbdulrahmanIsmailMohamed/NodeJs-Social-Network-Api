export interface CreateReply {
    commentId: string,
    replyBody: {
        userId: string,
        comment: string,
        image?: string
    }
}

export interface ReplySanitize {
    userId: {
        name: string,
        imageProfile: string
    },
    comment: string,
    likes: number,
    image?: string
}

export interface DeleteReply {
    commentId: string,
    replyId: string
}

export interface ReplyValidator {
    postId: {
        userId: string,
        postType: string
    }
}