import { Router } from "express";

import { protectRoute } from "../config/auth";
import { MarketplaceControlloer } from '../controllers/marketplace.controller';
import { uploadMedias, uploadSingleImage } from "../middlewares/multer";

const router: Router = Router();
const marketplaceControlloer = new MarketplaceControlloer();

// router.use(protectRoute);

router
    .route("/")
    .post(uploadMedias("images"), marketplaceControlloer.createItemForSale)
    .get(marketplaceControlloer.getItemsForSale);

router.get("/me", marketplaceControlloer.getLoggedUserItemsForSale);

router
    .route("/:id")
    .patch(uploadSingleImage("images"), marketplaceControlloer.updateItemForSale)
    .delete(marketplaceControlloer.deleteItem);

router.patch("/me/:id", marketplaceControlloer.unAvailable);

export default router;