import { UploadApiResponse } from "cloudinary";

import APIError from "../utils/apiError";
import { errorHandling } from "../utils/errorHandling"
// import { APIFeature } from "../utils/apiFeature";
import cloudinary from '../config/coludinaryConfig';
import { IMarketplace, ItemForSaleBody } from '../interfaces/marketplace.interface';
import { getLocationCoordinates } from "../utils/geoLocation";
import { Marketplace } from '../models/Marketplace';
import User from '../models/User';
import { IUser } from '../interfaces/user.Interface';

export class MarketplaceService {

    createItemForSale = async (itemForSaleBody: ItemForSaleBody) => {
        let { images, site, userId } = itemForSaleBody;

        if (images) {
            const mediaUrl: any = [];

            // store image in cloudinaru and store url in db
            for (const image of images) {
                const result = await errorHandling(
                    cloudinary.uploader.upload(image.path, {
                        folder: "uploads/posts",
                        format: "jpg",
                        public_id: `${Date.now()}-marketplace`,
                    })
                ) as UploadApiResponse;

                mediaUrl.push(result.url);
            }
            itemForSaleBody.images = mediaUrl;

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

                const geoLocation = await errorHandling(getLocationCoordinates(site)) as {
                    latitude: number | undefined;
                    longitude: number | undefined;
                } | null;

                itemForSaleBody.longitude = geoLocation?.longitude;
                itemForSaleBody.latitude = geoLocation?.latitude;
            }

            const itemForSale = await errorHandling(Marketplace.create(itemForSaleBody)) as IMarketplace;
            if (!itemForSale) throw new APIError("Can't Create Your item", 400);
            return itemForSale;
        }

        else throw new APIError("Image Must Be Not Null", 400);
    }

}