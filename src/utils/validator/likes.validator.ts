import { check } from "express-validator";
import { errorHandling } from "../../utils/errorHandling";
import Post from "../../models/Post";
import APIError from "../../utils/apiError";
import { validatorMW } from "../../middlewares/validatorMW";
import { UserId } from "../../interfaces/user.Interface";

export const likesValidator = [
  check("postId")
    .isMongoId()
    .withMessage("Invalid POst Id Format!!")
    .custom(async (val, { req }) => {
      const isPostExist = await errorHandling(
        Post.findOne({ _id: val }).populate("userId", "friends active").exec()
      );

      if (isPostExist) {
        const userId = isPostExist.userId as unknown as UserId;

        if (userId.active === false)
          throw new APIError("Post Not Exist!!", 404);
        else if (
          (isPostExist.postType === "private" &&
            userId._id === req.user._id.toString()) ||
          isPostExist.postType === "public"
        )
          return true;
        else if (isPostExist.postType === "friends") {
          console.log(isPostExist);

          if (
            userId.friends.includes(req.user._id) ||
            userId._id.toString() === req.user._id.toString()
          )
            return true;
          else throw new APIError("Your not access this post", 404);
        }
      }

      throw new APIError("post not found", 404);
    }),

  validatorMW,
];
