import { Paginate } from "./paginate.interface";
import { Document, ObjectId } from "mongoose";

export interface IPost extends Document {
  userId: ObjectId;
  post: string;
  postType: string;
  media?: string;
  likes?: number[];
  fans?: string[];
  share?: number;
  sharePost?: {
    post: string;
    ownerPost: string;
    sharePostId: string;
  };
}

export interface CreatePost {
  post: string;
  postType: string;
  userId: string;
  media?: Array<string>;
}

export interface UpdatePost extends CreatePost {
  postId: string;
}

export interface DeletePost extends Partial<UpdatePost> {}
export interface Features {
  page: number;
  limit: number;
  keyword?: string;
  userId?: string;
  postId?: string;
  friendId?: string;
  price?: string;
}

export interface GetAPIFeaturesResult {
  paginationResult: Paginate;
  data: IPost[];
}

export interface SharePost extends CreatePost {
  sharePostId: string;
}
