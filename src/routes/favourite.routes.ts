import { Router } from "express";
import { FavouriteController } from '../controllers/favourite.controller';
import { protectRoute } from "../config/auth";
import { addFavouriteValidator } from '../utils/validator/favourite.validator';

const router: Router = Router();
const favouriteController: FavouriteController = new FavouriteController();

router.use(protectRoute);

router.get("/", favouriteController.favourites);

router
    .route("/:postId")
    .post(addFavouriteValidator, favouriteController.addFavourite)
    .delete(favouriteController.deleteFavourite);

export default router;