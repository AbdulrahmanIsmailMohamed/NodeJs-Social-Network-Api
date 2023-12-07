export interface CreateReply {
    commentId: string,
    replyBody: {
        userId: string,
        comment: string,
        image?: string
    }
}

export interface DeleteReply {
    commentId: string,
    replyId: string,
    userId: string
}