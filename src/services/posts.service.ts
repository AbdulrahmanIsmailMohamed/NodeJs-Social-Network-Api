import moment from "moment";

import APIError from "../utils/apiError";
import Post from "../models/Post";
import { errorHandling } from "../utils/errorHandling";
import { APIFeature } from "../utils/apiFeature";
import User from "../models/User";
import cloudinary from "../config/coludinaryConfig";

import {
  CreatePost,
  DeletePost,
  Features,
  UpdatePost,
  GetAPIFeaturesResult,
  SharePost,
  IPost,
} from "../interfaces/post.interface";

export class PostService {
  constructor() {}

  createPost = async (
    postBody: CreatePost,
    mediaPath?: Array<Express.Multer.File>
  ): Promise<Partial<IPost>> => {
    if (mediaPath) {
      const mediaUrl: any = [];
      let format: string = "";

      for (const media of mediaPath) {
        if (media.mimetype.startsWith("image")) {
          format = "jpg"; // Set the format to 'jpg' for image uploads
        } else if (media.mimetype.startsWith("video")) {
          format = "mp4"; // Set the format to 'mp4' for video uploads
        } else if (media.mimetype.startsWith("application/pdf")) {
          format = "pdf"; // Set the format to 'mp4' for video uploads
        }

        const result = await errorHandling(
          cloudinary.uploader.upload(media.path, {
            folder: "uploads/posts",
            format,
            public_id: `${Date.now()}-posts`,
            resource_type: format === "mp4" ? "video" : "image",
          })
        );
        mediaUrl.push(result.url);
      }

      postBody.media = mediaUrl;
    }

    const newPost = await errorHandling(Post.create(postBody));
    if (!newPost) throw new APIError("Can't create post", 400);
    return this.removeSensitivePostFields(newPost);
  };

  updatePost = async (postBody: UpdatePost): Promise<Partial<IPost>> => {
    const { post, userId, postType, postId } = postBody;

    const updatePost = await errorHandling(
      Post.findOneAndUpdate(
        {
          _id: postId,
          userId,
        },
        {
          post,
          postType,
        },
        { new: true }
      ).exec()
    );
    if (!updatePost) throw new APIError("Can't update post", 400);
    return this.removeSensitivePostFields(updatePost);
  };

  deletePost = async (postBody: DeletePost): Promise<string> => {
    const { postId, userId } = postBody;

    const post = await errorHandling(
      Post.findOneAndDelete({ _id: postId, userId }).exec()
    );
    if (!post) throw new APIError("Can't delete post", 400);
    return "Done";
  };

  getLoggedUserPosts = async (
    features: Features
  ): Promise<GetAPIFeaturesResult> => {
    const { userId } = features;

    const countDocument: number = await errorHandling(
      Post.countDocuments({ userId }).exec()
    );

    const apiFeature = new APIFeature(
      Post.find({ userId }),
      features
    ).pagination(countDocument);

    const result = await errorHandling(apiFeature.execute("posts"));
    return result;
  };

  getUserPosts = async (features: Features): Promise<GetAPIFeaturesResult> => {
    const { userId, friendId } = features;

    const user = await errorHandling(
      User.findById(userId).select("friends").exec()
    );
    if (!user) throw new APIError("Not Found", 404);

    const isUserFriend =
      user.friends && user.friends.includes(friendId as string);

    const query = {
      userId: friendId,
      postType: { $in: isUserFriend ? ["public", "friends"] : "public" },
    };

    const countDocument = await errorHandling(
      Post.countDocuments(query).exec()
    );
    const apiFeature = new APIFeature(Post.find(query), features).pagination(
      countDocument
    );
    const result = await errorHandling(apiFeature.execute("posts"));

    return result;
  };

  hideUserPosts = async (postId: string, userId: string): Promise<string> => {
    const post = await errorHandling(
      Post.findById(postId).select("userId").exec()
    );
    if (!post) throw new APIError("Can't find post!", 404);

    // add userId to hideUserPosts Array
    const user = await errorHandling(
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { hideUserPosts: post.userId } },
        { new: true }
      )
        .select("hideUserPosts")
        .exec()
    );
    if (!user) throw new APIError("Can't find User!", 404);

    // after 1 month userId will delete from hideUserPosts
    const thirtyDaysInMilliseconds = 24 * 60 * 60 * 1000;
    setTimeout(async () => {
      const user = await errorHandling(
        User.findByIdAndUpdate(
          userId,
          { $pull: { hideUserPosts: post.userId } },
          { new: true }
        )
          .select("hideUserPosts")
          .exec()
      );
      if (!user) throw new APIError("Occur Error!!", 400);
      return "Done";
    }, thirtyDaysInMilliseconds);

    return "Done";
  };

  renderTimeline = async (
    features: Features
  ): Promise<GetAPIFeaturesResult> => {
    const { userId } = features;

    const user = await errorHandling(
      User.findOne({ _id: userId })
        .populate({
          path: "friends",
          match: { active: { $eq: true } },
        })
        .exec()
    );
    if (!user) throw new APIError(`Not Found User for this id: ${userId}`, 404);

    const friends = user.friends || [];
    const followUsers = user.followUsers || [];
    const hideUserPosts = user.hideUserPosts || [];

    const query = {
      $or: [
        {
          $and: [
            { postType: "public" },
            {
              userId: {
                $in: [...friends, ...followUsers],
                $nin: hideUserPosts,
              },
            },
          ],
        },
        {
          $and: [
            { postType: "friends" },
            {
              userId: {
                $in: friends,
                $nin: hideUserPosts,
              },
            },
          ],
        },
      ],
    };

    const countPosts = await errorHandling(Post.countDocuments(query).exec());

    const apiFeature = new APIFeature(Post.find(query), features).pagination(
      countPosts
    );

    const result = (await errorHandling(
      apiFeature.execute("posts")
    )) as GetAPIFeaturesResult;
    return result;
  };

  sharePost = async (sharePostData: SharePost) => {
    const { sharePostId, post, postType, userId } = sharePostData;
    const newSharePostBody = { post, postType, userId };

    const sharePost = await errorHandling(Post.findById(sharePostId).exec());
    if (!sharePost) throw new APIError("Share post not exist!!", 404);

    const newSharePost = await errorHandling(
      (
        await Post.create({
          ...newSharePostBody,
          sharePost: {
            sharePostId,
            post: sharePost.post,
            ownerPost: sharePost.userId,
            media: sharePost.media,
          },
        })
      ).populate({
        path: "sharePost",
        populate: {
          path: "ownerPost",
          populate: "name profileImage",
          select: "name profileImage",
        },
      })
    );

    if (!newSharePost) throw new APIError("Can't share post", 400);

    // update share number in sharePost
    sharePost.share
      ? (sharePost.share += 1)
      : console.log("share is undefined");
    await errorHandling(sharePost.save());

    return newSharePost;
  };

  postsCreatedOnTheSameDay = async (userId: string) => {
    const today = moment();
    const day = today.date();
    const month = today.month() + 1; // Note: moment's month is zero-based

    const posts = await errorHandling(
      Post.find({
        userId,
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: "$updatedAt" }, day] },
            { $eq: [{ $month: "$updatedAt" }, month] },
          ],
        },
      }).exec()
    );

    if (!posts) throw new APIError("Your not memories on the same day", 404);
    return posts;
  };

  private removeSensitivePostFields = (post: IPost) => ({
    _id: post._id,
    userId: post.userId,
    post: post.post,
    postType: post.postType,
    medias: post.media,
    likes: post.likes,
    share: post.share,
  });
}
