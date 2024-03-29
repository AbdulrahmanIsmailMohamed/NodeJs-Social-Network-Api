import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  number: string;
  email: string;
  city: string;
  password: string;
  passwordResetCode?: string;
  passwordResetCodeExpire?: number;
  passwordResetVerified?: boolean;
  numberOfFollowers?: number;
  isAdmin?: boolean;
  limitFriends?: number;
  limitFriendshipRequest?: number;
  address?: string;
  friends?: Array<string>;
  followers?: Array<string>;
  followUsers?: Array<string>;
  unFollowUsers?: Array<string>;
  profileImage?: string;
  profileImages?: Array<string>;
  myFriendshipRequests?: Array<string>;
  friendshipRequests?: Array<string>;
  favourites?: Array<Object>;
  hideUserPosts?: Array<string>;
  active?: boolean;
}

export interface UpdateLoggedUser {
  userId: string;
  name: string;
  address: string;
  city: string;
  number: string;
  imagePath?: string | undefined;
}

export interface UserId {
  _id: string;
  active: boolean;
  friends: string[];
}
