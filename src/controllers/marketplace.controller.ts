import { NextFunction, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandlerMW";
import APIError from "../utils/apiError";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import {
  IMarketplace,
  ItemForSaleBody,
  UpdateItemForSaleBody,
  ImageData,
  ItemsForSale,
} from "../interfaces/marketplace.interface";
import { MarketplaceService } from "../services/marketplace.service";
import { Features } from "../interfaces/post.interface";

export class MarketplaceControlloer {
  constructor(private marketplaceService: MarketplaceService) {}

  createItemForSale = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const itemForSaleBody: ItemForSaleBody = {
          userId: req.user._id as string,
          address: req.body.address,
          availability: req.body.availability,
          category: req.body.category,
          condition: req.body.condition,
          images: req.files as Array<Express.Multer.File>,
          price: req.body.price,
          site: req.body.site,
          description: req.body.description,
          tradMark: req.body.tradMark,
        };

        const itemForSale = await this.marketplaceService.createItemForSale(
          itemForSaleBody
        );
        if (!itemForSale) {
          return next(new APIError("Can't create your item", 400));
        }
        res.status(201).json({ status: "Success", itemForSale });
      } else return next(new APIError("Please Login", 401));
    }
  );

  updateItemForSale = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const updateItemForSaleBody: UpdateItemForSaleBody = {
          itemForSaleId: req.params.id,
          userId: req.user._id as string,
          address: req.body.address,
          availability: req.body.availability,
          category: req.body.category,
          condition: req.body.condition,
          images: req.files as Array<Express.Multer.File>,
          price: req.body.price,
          site: req.body.site,
          description: req.body.description,
          tradMark: req.body.tradMark,
        };

        const itemForSale = await this.marketplaceService.updateItemForSale(
          updateItemForSaleBody
        );
        if (!itemForSale) {
          return next(new APIError("can't update your item", 400));
        }
        res.status(200).json({ status: "Success", itemForSale });
      } else return next(new APIError("Please Login", 401));
    }
  );

  deleteImage = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const imageData: ImageData = {
          imageUrl: req.query.imageUrl as any,
          userId: req.user._id as string,
          itemForSaleId: req.params.id,
        };

        const deleteImage: string = await this.marketplaceService.deleteImage(
          imageData
        );
        res.status(204).json({ status: "Success", message: deleteImage });
      } else return next(new APIError("Please Login", 401));
    }
  );

  unAvailable = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const [itemForSaleId, userId] = [req.params.id, req.user._id as string];

        const unAvailableItem = await this.marketplaceService.unAvailable(
          itemForSaleId,
          userId
        );
        if (!unAvailableItem) {
          return next(new APIError("Can't update item", 400));
        }
        res.status(200).json({ status: "Success", message: unAvailableItem });
      } else return next(new APIError("Please Login", 401));
    }
  );

  deleteItem = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const [itemForSaleId, userId] = [req.params.id, req.user._id as string];

        const item = await this.marketplaceService.deleteItem(
          itemForSaleId,
          userId
        );
        if (!item) return next(new APIError("Can't update item", 400));
        res.status(204).json({ status: "Success", message: item });
      } else return next(new APIError("Please Login", 401));
    }
  );

  getItemsForSale = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const features: Features = {
          limit: parseInt(req.query.limit as string) || 5,
          page: parseInt(req.query.page as string) || 1,
          keyword: req.query.keyword as any,
          userId: req.user._id,
          price: req.query.price as string,
        };

        const itemsForSale = await this.marketplaceService.getItemsForSale(
          features
        );
        if (!itemsForSale) return next(new APIError("Can't get items", 404));

        const { data, paginationResult } = itemsForSale;
        res.status(200).json({
          status: "Success",
          pagination: paginationResult,
          itemsForSale: data,
        });
      } else return next(new APIError("Please Login", 401));
    }
  );

  getLoggedUserItemsForSale = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const userId = req.user._id as string;

        const itemsForSale =
          await this.marketplaceService.getLoggedUserItemsForSale(userId);
        if (!itemsForSale) return next(new APIError("Can't get items", 404));
        res.status(200).json({ status: "Success", itemsForSale });
      } else return next(new APIError("Please Login", 401));
    }
  );
}
