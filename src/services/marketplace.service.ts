import { UploadApiResponse } from "cloudinary";

import APIError from "../utils/apiError";
import { errorHandling } from "../utils/errorHandling"
// import { APIFeature } from "../utils/apiFeature";
import cloudinary from '../config/coludinaryConfig';
import { IMarketplace, ItemForSaleBody, UpdateItemForSaleBody } from '../interfaces/marketplace.interface';
import { getLocationCoordinates } from "../utils/geoLocation";
import { Marketplace } from '../models/Marketplace';
import User from '../models/User';
import { GetUser, IUser } from '../interfaces/user.Interface';

export class MarketplaceService {

    createItemForSale = async (itemForSaleBody: ItemForSaleBody): Promise<IMarketplace> => {
        let { images, site, userId } = itemForSaleBody;

        if (images) {
            // git longitude and latitude from site, if user not added his site we will get site by his Id
            const geoLocation = await errorHandling(getLocationCoordinates(site)) as {
                latitude: number | undefined;
                longitude: number | undefined;
            } | null;
            itemForSaleBody.longitude = geoLocation?.longitude;
            itemForSaleBody.latitude = geoLocation?.latitude;

            if (!geoLocation) {
                const user = await errorHandling(User.findById(userId)) as IUser;
                const site = user.address as string;
                if (!site) throw new APIError("Must add your address in your profile", 400);

                const geoLocation = await errorHandling(getLocationCoordinates(site)) as {
                    latitude: number | undefined;
                    longitude: number | undefined;
                } | null;
                itemForSaleBody.longitude = geoLocation?.longitude;
                itemForSaleBody.latitude = geoLocation?.latitude;
                itemForSaleBody.site = site;
            }

            // store image in cloudinaru and store url in db
            const mediaUrl: any = [];
            for (const image of images) {
                const result = await errorHandling(
                    cloudinary.uploader.upload(image.path, {
                        folder: "uploads/marketplace",
                        format: "jpg",
                        public_id: `${Date.now()}-marketplace`,
                    })
                ) as UploadApiResponse;

                mediaUrl.push(result.url);
            }
            itemForSaleBody.images = mediaUrl;

            const itemForSale = await errorHandling(
                (await Marketplace.create(itemForSaleBody)).populate("userId", "name profileImage")
            ) as IMarketplace;

            if (!itemForSale) throw new APIError("Can't Create Your item", 400);
            return itemForSale;
        }

        else throw new APIError("Image Must Be Not Null", 400);
    }

    updateItemForSale = async (updateItemForSaleBody: UpdateItemForSaleBody): Promise<IMarketplace> => {
        let { images, site, userId, itemForSaleId } = updateItemForSaleBody;

        if (images) {
            // store image in cloudinaru and store url in db
            const mediaUrl: any = [];
            for (const image of images) {
                const result = await errorHandling(
                    cloudinary.uploader.upload(image.path, {
                        folder: "uploads/marketplace",
                        format: "jpg",
                        public_id: `${Date.now()}-marketplace`,
                    })
                ) as UploadApiResponse;

                mediaUrl.push(result.url);
            }
            updateItemForSaleBody.images = mediaUrl;
        }

        if (site) {
            // git longitude and latitude from site, if user not added his site we will get site by his Id
            const geoLocation = await errorHandling(getLocationCoordinates(site)) as {
                latitude: number | undefined;
                longitude: number | undefined;
            } | null;
            updateItemForSaleBody.longitude = geoLocation?.longitude;
            updateItemForSaleBody.latitude = geoLocation?.latitude;

            if (!geoLocation) {
                const user = await errorHandling(User.findById(userId)) as IUser;
                const site = user.address as string;
                if (!site) throw new APIError("Must add your address in your profile", 400);

                const geoLocation = await errorHandling(getLocationCoordinates(site)) as {
                    latitude: number | undefined;
                    longitude: number | undefined;
                } | null;
                updateItemForSaleBody.longitude = geoLocation?.longitude;
                updateItemForSaleBody.latitude = geoLocation?.latitude;
                updateItemForSaleBody.site = site;
            }
        }

        const itemForSale = await errorHandling(
            Marketplace.findOneAndUpdate(
                { _id: itemForSaleId, userId },
                updateItemForSaleBody,
                { new: true }
            ).populate("userId", "name profileImage")
        ) as IMarketplace;
        if (!itemForSale) throw new APIError(`Can't find item for this id ${itemForSaleId}`, 404);
        return itemForSale;
    }

    unAvailable = async (itemForSaleId: string, userId: string): Promise<string> => {
        const unAvailableItem = await errorHandling(
            Marketplace.findOneAndUpdate(
                { _id: itemForSaleId, userId },
                { unAvailable: true },
            )
        ) as IMarketplace;
        if (!unAvailableItem) throw new APIError("your item not exist!", 404);
        return "Done"
    }

    deleteItem = async (itemForSaleId: string, userId: string): Promise<string> => {
        const deleteItem = await errorHandling(Marketplace.findOneAndDelete({ _id: itemForSaleId, userId })) as IMarketplace;
        if (!deleteItem) throw new APIError("your item not exist!", 404);
        return "Done"
    }

    getItemsForSale = async (userId: string): Promise<IMarketplace> => {
        const cityOfUser = await errorHandling(User.findOne({ _id: userId }).select("city")) as GetUser;
        if (!cityOfUser.city) throw new APIError("Please Add your city to show items in your city or select show all items", 400);

        let query = {
            unAvailable: false,
            $or: [
                { site: cityOfUser.city },
                { site: cityOfUser.address },
            ]
        }

        const itemsForSale = await errorHandling(Marketplace.find(query)) as IMarketplace;
        if (!itemsForSale) throw new APIError("Can't find items for sale", 404);
        return itemsForSale
    }

    getLoggedUserItemsForSale = async (userId: string): Promise<IMarketplace> => {
        const itemsForSale = await errorHandling(Marketplace.findOne({ userId })) as IMarketplace;
        if (!itemsForSale) throw new APIError("Can't find items for sale", 404);
        return itemsForSale
    }

}