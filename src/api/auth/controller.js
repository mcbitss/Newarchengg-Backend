// import { loginMail } from "../../services/email/email";
import { sign } from "../../services/jwt";
import { CustomError } from "../../services/Util/Util";
import Users from "../users/model";

export const login = async ({ user, ...req }, res, next) => {
  try {
    if (!user) {
      throw new CustomError("Invalid Credentials", false, 401);
    }

    const token = await sign({
      id: user.id,
      name: user.name,
      email: user.email
    });

    if (req.body.notificationToken) {
      await Users.findOneAndUpdate({ _id: user.id }, { notificationToken: req.body.notificationToken });
    }

    res.send({ token, result: user, error: false });
  } catch (error) {
    next(error);
  }
};
