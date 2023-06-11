import { Router } from "express";
import { FavouriteController } from '../controllers/favourite.controller';
import { protectRoute } from "../config/auth";

const router: Router = Router();
const favouriteController = new FavouriteController();

router.use(protectRoute);

router.get("/", favouriteController.favourites);

router
    .route("/:postId")
    .post(favouriteController.addFavourite)
    .delete(favouriteController.deleteFavourite);

export default router;