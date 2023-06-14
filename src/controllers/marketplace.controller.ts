import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandlerMW";
import APIError from "../utils/apiError";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import { ItemForSaleBody, UpdateItemForSaleBody } from "../interfaces/marketplace.interface";
import { MarketplaceService } from '../services/marketplace.service';

export class MarketplaceControlloer {
    private marketplaceService: MarketplaceService;
    constructor() {
        this.marketplaceService = new MarketplaceService()
    }

    createItemForSale = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
                tradMark: req.body.tradMark
            }

            const itemForSale = await this.marketplaceService.createItemForSale(itemForSaleBody);
            if (!itemForSale) return next(new APIError("Can't create your item", 400));
            res.status(201).json({ status: "Success", itemForSale });
        }
        else return next(new APIError("Please Login", 401));
    });

    updateItemForSale = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
                tradMark: req.body.tradMark
            }

            const itemForSale = await this.marketplaceService.updateItemForSale(updateItemForSaleBody)
            if (!itemForSale) return next(new APIError("can't update your item", 400));
            res.status(200).json({ status: "Success", itemForSale });
        }
        else return next(new APIError("Please Login", 401));
    });

    unAvailable = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const [itemForSaleId, userId] = [req.params.id, req.user._id as string];

            const unAvailableItem = await this.marketplaceService.unAvailable(itemForSaleId, userId)
            if (!unAvailableItem) return next(new APIError("Can't update item", 400));
        }
        else return next(new APIError("Please Login", 401));
    });
    

}