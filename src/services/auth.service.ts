import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import APIError from "../utils/apiError";
import { hashCode } from "../utils/hashCode";
import { sendMail } from "../utils/sendMail";

import {
  LoginBody,
  RegisterBody,
} from "../interfaces/authentication.interface";
import { IUser } from "interfaces/user.Interface";

class AuthService {
  constructor() {}

  register = async (
    registerBody: RegisterBody
  ): Promise<{ user: Partial<IUser>; accessToken: string }> => {
    const user = await errorHandling(User.create(registerBody));

    if (!user) throw new APIError("event error when you registerd", 400);
    return {
      user: this.removeSensitiveUserFields(user),
      accessToken: this.accessToken(user._id),
    };
  };

  login = async (
    loginBody: LoginBody
  ): Promise<{ user: Partial<IUser>; accessToken: string }> => {
    const { email, password } = loginBody;

    const user = await errorHandling(
      User.findByIdAndUpdate({ email }, { active: true }, { new: true })
        .select("_id name email password")
        .exec()
    );

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new APIError("Invalid email or password", 401);
    }

    return {
      user: this.removeSensitiveUserFields(user),
      accessToken: this.accessToken(user._id),
    };
  };

  forgotPassword = async (email: string): Promise<string> => {
    const user = await errorHandling(
      User.findOne({ email }).select("email name").exec()
    );
    if (!user) {
      throw new APIError(
        "Can't find user for this email, please register",
        404
      );
    }

    // Generate hash reset random 6 digits and save via db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetCode = hashCode(resetCode);
    user.passwordResetCodeExpire = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();

    // send reset code via email by nodemailer
    const message = `
        <h2>Hi ${user.name}</h2>
        <p>We received a request to reset the password on your Social-Network Account.</p>
        <h3>${resetCode}</h3>
        <p>Enter this code to complete the reset</p>
        <p>Thanks for helping us keep your account secure</p>
        <p>The Social-Network Team</p>
      `;
    try {
      await sendMail({
        email: user.email,
        message,
        subject: "Your Password Rest Code (Valid For 10 Minute)",
      });
    } catch (error) {
      this.resetForgottenPassword(user);
      throw new APIError("Internal Server Error", 500);
    }

    return "The Reset Code send via email";
  };

  verifyRestCode = async (resetCode: string): Promise<string> => {
    const user = await errorHandling(
      User.findOneAndUpdate(
        {
          passwordResetCode: hashCode(resetCode),
          passwordResetCodeExpire: { $gt: Date.now() },
        },
        { passwordResetVerified: true }
      ).exec()
    );
    if (!user) throw new APIError("ResetCode Invalid Or Expire", 400);
    return "Now You Can Change Password";
  };

  resetPassword = async (
    email: string,
    newPassword: string
  ): Promise<string> => {
    const user = await errorHandling(
      User.findOne({ email })
        .select(
          "password passwordResetCode passwordResetCodeExpire passwordResetVerified email"
        )
        .exec()
    );

    if (!user) throw new APIError("This Email Not Exist, Please Register", 404);
    if (user.passwordResetVerified === false) {
      throw new APIError("ResetCode Not Valid", 400);
    }

    user.password = newPassword;
    this.resetForgottenPassword(user);

    return this.accessToken(user._id);
  };

  private resetForgottenPassword = async (user: IUser): Promise<void> => {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpire = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
  };

  private removeSensitiveUserFields = (user: IUser) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    number: user.number,
    address: user.address,
  });

  private accessToken = (userId: string) =>
    jwt.sign({ userId }, process.env.JWT_SEC as string, {
      expiresIn: process.env.JWT_EXPIRE as string,
    });
}

export default AuthService;
