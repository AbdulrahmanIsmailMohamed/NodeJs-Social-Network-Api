import { Router } from "express";

import { protectRoute } from "../config/auth";
import { MarketplaceControlloer } from '../controllers/marketplace.controller';
import { uploadMedias, uploadSingleImage } from "../middlewares/multer";
import { createItemForSaleValidator, deleteImageValidator, itemForSaleValidator, updateItemForSaleValidator } from '../utils/validator/marketplace.validator';

const router: Router = Router();
const marketplaceControlloer = new MarketplaceControlloer();

router.use(protectRoute);

router
    .route("/")
    .post(uploadMedias("images"), createItemForSaleValidator, marketplaceControlloer.createItemForSale)
    .get(marketplaceControlloer.getItemsForSale);

router.get("/me", marketplaceControlloer.getLoggedUserItemsForSale);

router
    .route("/:id")
    .patch(uploadMedias("images"), updateItemForSaleValidator, marketplaceControlloer.updateItemForSale)
    .delete(itemForSaleValidator, marketplaceControlloer.deleteItem);

router.delete("/image/:id", deleteImageValidator, marketplaceControlloer.deleteImage);
router.patch("/me/:id", itemForSaleValidator, marketplaceControlloer.unAvailable);

export default router;