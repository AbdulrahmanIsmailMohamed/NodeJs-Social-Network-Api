import APIError from "../utils/apiError";
import { Comment } from "../models/Comments";
import { errorHandling } from "../utils/errorHandling";
import { APIFeature } from "../utils/apiFeature";
import { Features } from "../interfaces/post.interface";
import cloudinary from "../config/coludinaryConfig";

import {
  CreateComment,
  DeleteComment,
  GetAPIFeaturesResult,
  IComment,
  UpdateComment,
} from "../interfaces/comments.interface";

export class CommentService {
  constructor() {}

  createComment = async (
    commentBody: CreateComment,
    imagePath: string | undefined
  ): Promise<Partial<IComment>> => {
    if (imagePath) {
      const result = await errorHandling(
        cloudinary.uploader.upload(imagePath, {
          folder: "uploads/comments",
          format: "jpg",
          public_id: `${Date.now()}-comment`,
        })
      );

      if (!result) throw new APIError("Internal Server Error", 500);
      commentBody.image = result.url;
    }

    const comment = await errorHandling(
      (
        await Comment.create(commentBody)
      ).populate("userId", "name imageProfile")
    );
    if (!comment) throw new APIError("Can't create comment", 400);
    return this.removeSensitiveCommentFields(comment);
  };

  updateComment = async (commentData: UpdateComment): Promise<IComment> => {
    const { commentId, userId, commentBody } = commentData;

    const updateComment = await errorHandling(
      Comment.findOneAndUpdate(
        {
          _id: commentId,
          userId,
        },
        commentBody,
        { new: true }
      )
        .populate("userId", "name profileImage")
        .exec()
    );
    if (!updateComment) throw new APIError("Can't find this comment", 404);
    return updateComment;
  };

  deleteComment = async (commentData: DeleteComment): Promise<string> => {
    const { commentId, userId } = commentData;

    const comment = await errorHandling(
      Comment.findOneAndDelete({ _id: commentId, userId }).lean().exec()
    );

    /*
        if the user is not the owner comment,
        check if the user is the owner of the post containing the comment
    */
    if (!comment) {
      const isOwnerPost = await errorHandling(
        Comment.findOneAndDelete({ _id: commentId })
          .select("postId")
          .populate({
            path: "postId",
            match: { userId },
          })
          .exec()
      );
      if (!isOwnerPost) throw new APIError("Can't delete comment", 400);
    }
    return "Done";
  };

  getPostComments = async (
    features: Features
  ): Promise<GetAPIFeaturesResult> => {
    const { postId } = features;
    const countDocuments = await errorHandling(
      Comment.countDocuments({ postId }).exec()
    );
    if (!countDocuments) throw new APIError("can't find comments", 404);

    const apiFeatures = new APIFeature(
      Comment.find({ postId }),
      features
    ).pagination(countDocuments);

    const comments = await errorHandling(apiFeatures.execute("posts"));
    if (!comments) throw new APIError("Can't find comments", 404);
    return comments;
  };

  getComment = async (commentId: string): Promise<Partial<IComment>> => {
    const comment = await errorHandling(
      Comment.findById(commentId).populate("userId", "name profileImage").exec()
    );

    if (!comment) throw new APIError("can't find comment", 404);
    return this.removeSensitiveCommentFields(comment);
  };

  private removeSensitiveCommentFields = (comment: IComment) => ({
    _id: comment._id,
    userId: comment.userId,
    postId: comment.postId,
    comment: comment.comment,
    image: comment.image,
    likes: comment.likes,
    reply: comment.reply,
  });
}
