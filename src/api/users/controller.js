import md5 from "md5";
import { CustomError, getDataWithPage } from "../../services/Util/Util";
import Tokens from "../tokens/model";
import Users from "./model";

export const convertUserData = (userData) => userData;

export const getUsers = async (req, res, next) => {
  try {
    const response = await getDataWithPage(
      Users,
      { _id: { $ne: req.user.id }, entityType: ["Member", "Business"] },
      { password: 0 }
    );
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const checkUser = await Users.findOne({ _id: req.user.id, password: md5(req.body.oldPassword) });

    if (checkUser) {
      await Users.findOneAndUpdate({ _id: checkUser.id }, { password: md5(req.body.password) });
    } else {
      throw new CustomError("Invalid old password! Please try again");
    }

    res.send({ result: {} });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, otp, password } = req.body;

    const checkToken = await Tokens.findOne({ token, otp });

    if (!checkToken) {
      throw new CustomError("Invalid OTP!");
    }

    await Users.findOneAndUpdate({ _id: checkToken.user }, { password: md5(password) });
    await Tokens.findOneAndUpdate({ token }, { status: "InActive" });

    res.send({ result: {} });
  } catch (err) {
    next(err);
  }
};
