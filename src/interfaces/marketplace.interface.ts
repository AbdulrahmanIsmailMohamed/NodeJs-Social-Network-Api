import { Document, ObjectId } from "mongoose";
import { Paginate } from "./paginate.interface";

export enum Condition {
  "New",
  "Used - LikeNew",
  "Used - In GoodCondition",
  "Used - In FairCondition",
}
export enum Availability {
  "View As A Single Item",
  "view As Available",
}

export interface IMarketplace extends Document {
  userId: ObjectId;
  address: string;
  price: number;
  category: string;
  unAvailable: boolean;
  images: Array<string>;
  site: string;
  condition: string;
  availability: Array<Availability>;
  description: string;
  longitude?: number;
  latitude?: number;
  tradMark?: string;
}

export interface ItemForSaleBody {
  userId: string;
  address: string;
  price: number;
  category: string;
  site: string;
  images: Array<Express.Multer.File>;
  condition: string;
  availability: string;
  description?: string;
  tradMark?: string;
  longitude?: number | undefined;
  latitude?: number | undefined;
}

export interface UpdateItemForSaleBody extends Partial<ItemForSaleBody> {
  itemForSaleId: string;
  // unAvailable?: boolean
}

export interface ImageData {
  userId: string;
  itemForSaleId: string;
  imageUrl: string;
}

export interface ItemsForSale {
  data: Array<IMarketplace>;
  paginationResult: Paginate;
}
