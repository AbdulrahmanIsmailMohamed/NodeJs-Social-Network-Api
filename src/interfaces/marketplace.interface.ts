import { Document, ObjectId } from "mongoose"

enum Condition {
    "New",
    "Used - LikeNew",
    "Used - In GoodCondition",
    "Used - In FairCondition",
}
enum Availability {
    "View As A Single Item",
    "view As Available",
}

export interface IMarketplace extends Document {
    userId: ObjectId,
    address: string,
    price: number,
    category: string,
    images: Array<string>,
    condition: Array<Condition>,
    availability: Array<Availability>,
    description: string,
    longitude: number,
    latitude: number,
    tradMark?: string,
}

export interface ItemForSaleBody {
    userId: string,
    address: string,
    price: number,
    category: string,
    site: string,
    images: Array<Express.Multer.File>,
    condition: string,
    availability: string,
    description?: string,
    tradMark?: string,
    longitude?: number | undefined
    latitude?: number | undefined
}

