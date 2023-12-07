import APIError from "../utils/apiError";
import { errorHandling } from "../utils/errorHandling";
import cloudinary from "../config/coludinaryConfig";
import { getLocationCoordinates } from "../utils/geoLocation";
import { Marketplace } from "../models/Marketplace";
import User from "../models/User";
import { APIFeature } from "../utils/apiFeature";
import { Features } from "../interfaces/post.interface";
import {
  ImageData,
  IMarketplace,
  ItemForSaleBody,
  ItemsForSale,
  UpdateItemForSaleBody,
} from "../interfaces/marketplace.interface";

export class MarketplaceService {
  createItemForSale = async (
    itemForSaleBody: ItemForSaleBody
  ): Promise<IMarketplace> => {
    let { images, site, userId } = itemForSaleBody;

    if (images.length !== 0) {
      // git longitude and latitude from site, if user not added his site we will get site by his Id
      const geoLocation = (await errorHandling(
        getLocationCoordinates(site)
      )) as {
        latitude: number | undefined;
        longitude: number | undefined;
      } | null;
      itemForSaleBody.longitude = geoLocation?.longitude;
      itemForSaleBody.latitude = geoLocation?.latitude;

      if (!geoLocation) {
        const user = await errorHandling(User.findById(userId).exec());
        if (!user) throw new APIError("User not found", 404);

        const site = user.address as string;
        if (!site) {
          throw new APIError("Must add your address in your profile", 400);
        }

        const geoLocation = await errorHandling(getLocationCoordinates(site));
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
        );

        mediaUrl.push(result.url);
      }
      itemForSaleBody.images = mediaUrl;

      const itemForSale = await errorHandling(
        (
          await Marketplace.create(itemForSaleBody)
        ).populate("userId", "name profileImage")
      );

      if (!itemForSale) throw new APIError("Can't Create Your item", 400);
      return itemForSale;
    } else throw new APIError("Image Must Be Not Null", 400);
  };

  updateItemForSale = async (
    updateItemForSaleBody: UpdateItemForSaleBody
  ): Promise<IMarketplace> => {
    let { images, site, userId, itemForSaleId } = updateItemForSaleBody;

    if (images) {
      // store image in cloudinaru and store url in db
      const mediaUrl: any = [];
      const mediaPublicId: any = [];
      for (const image of images) {
        const result = await errorHandling(
          cloudinary.uploader.upload(image.path, {
            folder: "uploads/marketplace",
            format: "jpg",
            public_id: `${Date.now()}-marketplace`,
          })
        );
        mediaUrl.push(result.url);
        mediaPublicId.push(result.public_id);
      }
      updateItemForSaleBody.images = mediaUrl;
    }

    if (site) {
      // git longitude and latitude from site, if user not added his site we will get site by his Id
      const geoLocation = (await errorHandling(
        getLocationCoordinates(site)
      )) as {
        latitude: number | undefined;
        longitude: number | undefined;
      } | null;
      updateItemForSaleBody.longitude = geoLocation?.longitude;
      updateItemForSaleBody.latitude = geoLocation?.latitude;

      if (!geoLocation) {
        const user = await errorHandling(User.findById(userId).exec());
        if (!user) throw new APIError("User not found", 404);

        const site = user.address as string;
        if (!site) {
          throw new APIError("Must add your address in your profile", 400);
        }

        const geoLocation = await errorHandling(getLocationCoordinates(site));
        updateItemForSaleBody.longitude = geoLocation?.longitude;
        updateItemForSaleBody.latitude = geoLocation?.latitude;
        updateItemForSaleBody.site = site;
      }
    }

    // store images in new variable and delete them from body
    const storeImages = updateItemForSaleBody.images;
    delete updateItemForSaleBody.images;

    const itemForSale = await errorHandling(
      Marketplace.findOneAndUpdate(
        { _id: itemForSaleId, userId },
        {
          $addToSet: { images: storeImages },
          ...updateItemForSaleBody,
        },
        { new: true }
      )
        .populate("userId", "name profileImage")
        .exec()
    );
    if (!itemForSale) {
      throw new APIError(`Can't find item for this id ${itemForSaleId}`, 404);
    }
    return itemForSale;
  };

  deleteImage = async (imageData: ImageData): Promise<string> => {
    const { imageUrl, userId, itemForSaleId } = imageData;

    // Extract the path from the image URL
    const pathMatch = imageUrl.match(/\/v\d+\/([^/]+\/[^/]+\/[^/.]+)/);
    const imagePublicId = pathMatch ? pathMatch[1] : null;

    if (imagePublicId) {
      const { result } = await errorHandling(
        cloudinary.uploader.destroy(imagePublicId)
      );
      if (result === "not found") throw new APIError("Image not found", 404);

      const deleteImage = await errorHandling(
        Marketplace.findOneAndUpdate(
          { _id: itemForSaleId, userId },
          { $pull: { images: imageUrl } }
        ).exec()
      );
      if (!deleteImage) throw new APIError("Can't find item for sale", 400);
      return "Done";
    } else throw new APIError("Can't get image public id", 400);
  };

  unAvailable = async (
    itemForSaleId: string,
    userId: string
  ): Promise<string> => {
    const unAvailableItem = await errorHandling(
      Marketplace.findOneAndUpdate(
        { _id: itemForSaleId, userId },
        { unAvailable: true }
      ).exec()
    );
    if (!unAvailableItem) throw new APIError("your item not exist!", 404);
    return "Done";
  };

  deleteItem = async (
    itemForSaleId: string,
    userId: string
  ): Promise<string> => {
    const deleteItem = await errorHandling(
      Marketplace.findOneAndDelete({ _id: itemForSaleId, userId }).exec()
    );
    if (!deleteItem) throw new APIError("your item not exist!", 404);
    return "Done";
  };

  getItemsForSale = async (features: Features): Promise<ItemsForSale> => {
    const { userId } = features;

    const cityOfUser = await errorHandling(
      User.findOne({ _id: userId }).select("city").exec()
    );
    if (!cityOfUser) throw new APIError("Can't find city of user", 404);

    if (!cityOfUser.city) {
      throw new APIError(
        "Please Add your city to show items in your city or select show all items",
        400
      );
    }

    let query = {
      unAvailable: false,
      $or: [{ site: cityOfUser.city }, { site: cityOfUser.address }],
    };

    const countDocument = await errorHandling(
      Marketplace.countDocuments(query).exec()
    );
    const apiFeature = new APIFeature(Marketplace.find(query), features)
      .pagination(countDocument)
      .search("Marketplace")
      .filter();

    const itemsForSale = await errorHandling(apiFeature.execute("Marketplace"));
    if (!itemsForSale) throw new APIError("Can't find items for sale", 404);
    return itemsForSale;
  };

  getLoggedUserItemsForSale = async (userId: string) => {
    const itemsForSale = await errorHandling(
      Marketplace.find({ userId }).exec()
    );
    if (!itemsForSale) throw new APIError("Can't find items for sale", 404);
    return itemsForSale;
  };
}
