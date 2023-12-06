import { Document, ObjectId } from "mongoose";

import { Paginate } from "./paginate.interface";

export interface IComment extends Document {
  userId: string;
  postId: string;
  comment: string;
  likes?: number;
  image?: string;
  reply?: ReplyInterface[];
}

interface ReplyInterface {
  userId: ObjectId;
  comment: string;
  likes?: number;
  image?: string;
}

export interface CreateComment {
  userId: string;
  postId: string;
  comment: string;
  image?: string;
}

export interface UpdateComment {
  userId: string;
  commentId: string;
  commentBody?: {
    comment: string;
    image: string;
  };
}

export interface DeleteComment {
  userId: string;
  commentId: string;
}

export interface GetAPIFeaturesResult {
  paginationResult: Paginate;
  data: IComment[];
}
