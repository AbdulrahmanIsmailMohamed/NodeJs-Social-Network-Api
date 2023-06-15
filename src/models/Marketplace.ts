import { Schema, model } from "mongoose";
import { IMarketplace } from '../interfaces/marketplace.interface';

const marketplaceSchema = new Schema<IMarketplace>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        images: {
            type: [String],
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        site: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
        },
        condition: {
            type: [String],
            required: true,
            enum: [
                "New",
                "Used - LikeNew",
                "Used - In GoodCondition",
                "Used - In FairCondition"
            ]
        },
        unAvailable: {
            type: Boolean,
            default: false
        },
        availability: {
            type: [String],
            required: true,
            enum: [
                "View As A Single Item",
                "view As Available"
            ]
        },
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        tradMark: {
            type: String
        }
    }
);

export const Marketplace = model<IMarketplace>("Marketplace", marketplaceSchema);