import { Router } from "express";

import { protectRoute } from "../config/auth";
import { MarketplaceControlloer } from '../controllers/marketplace.controller';
import { uploadMedias } from "../middlewares/multer";

const router: Router = Router();
const marketplaceControlloer = new MarketplaceControlloer();

router.use(protectRoute);

router
    .route("/")
    .post(uploadMedias("images"), marketplaceControlloer.createItemForSale)

export default router;