import { v4 } from "uuid";
import { decryptText, encryptText, getDataWithPage } from "../../services/Util/Util";
import { convertUserData } from "../users/controller";
import Users from "../users/model";
import Tokens from "./model";

export const generateToken = async ({
  token = v4(),
  partner,
  business,
  user,
  doctor,
  entityType,
  entityId,
  entityReference,
  entityEmail,
  expiryDate,
  role,
  otp
}) => {
  const tokenData = await Tokens.create({
    partner,
    business,
    token,
    user,
    doctor,
    entityType,
    entityId,
    entityReference,
    entityEmail,
    expiryDate,
    role,
    otp,
    status: "Active"
  });

  return tokenData ? tokenData.token : false;
};

export const validateExpiryToken = async (req, res) => {
  const token = await Tokens.findOne(
    { token: req.params.token, expiryDate: { $gte: Date() }, status: "Active" },
    {},
    { sort: { createdAt: -1 } }
  );

  if (res) {
    if (token) {
      return res.status(200).send({ id: token.entityId });
    }

    return res.status(404).send({ message: "Token not found" });
  }

  return token;
};

export const closeToken = async (req, res) => {
  await Tokens.findOneAndUpdate({ token: req.params.token }, { status: "InActive" });

  if (res) {
    return res.send({ success: true, message: "Success", result: {} });
  }

  return true;
};

export const validateToken = async (req, res, next) => {
  try {
    const tokenData = await Tokens.findOne({ token: req.params.token, status: "Active" });

    const result = {};

    if (tokenData) {
      const user = await Users.findOne({ email: tokenData.entityEmail }, { password: 0 });
      const userData = user ? convertUserData(user) : false;
      result.token = tokenData.token;
      result.userExists = !!userData;
      result.email = userData?.email || decryptText(tokenData.entityEmail);
      result.userName = userData?.userName || "";
      result.userData = userData;
      res.send({ result });
    } else {
      res.send();
    }
  } catch (error) {
    next(error);
  }
};

export const getDoctorInvitations = async (req, res, next) => {
  try {
    const query = { ...req.query, business: req.user.business, entityType: "Business_User_Registration" };

    if (query.entityEmail) {
      query.entityEmail = encryptText(query.entityEmail);
    }

    const response = await getDataWithPage(
      Tokens,
      query,
      {},
      { sort: { createdAt: -1 }, populate: "userData" }
    );

    if (response.result) {
      response.result = response.result.map((v) => {
        v.entityEmail = decryptText(v.entityEmail);

        return v;
      });
    }

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getPatientInvitations = async (req, res, next) => {
  try {
    const query = { ...req.query, business: req.user.business, entityType: "Patient_User_Registration" };

    if (query.entityEmail) {
      query.entityEmail = encryptText(query.entityEmail);
    }

    const response = await getDataWithPage(
      Tokens,
      query,
      {},
      { sort: { createdAt: -1 }, populate: "userData" }
    );

    if (response.result) {
      response.result = response.result.map((v) => {
        v.entityEmail = decryptText(v.entityEmail);

        return v;
      });
    }

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getBusinessInvitations = async (req, res, next) => {
  try {
    const query = { ...req.query, partner: req.user.partner, entityType: "Business_Registration" };

    if (query.entityEmail) {
      query.entityEmail = encryptText(query.entityEmail);
    }

    const response = await getDataWithPage(
      Tokens,
      query,
      {},

      { sort: { createdAt: -1 }, populate: "userData" }
    );

    if (response.result) {
      response.result = response.result.map((v) => {
        v.entityEmail = decryptText(v.entityEmail);

        return v;
      });
    }

    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getPartnerUserInvitations = async (req, res, next) => {
  try {
    // console.log(req.user.partner);
    const query = { ...req.query, partner: req.user.partner, entityType: "Partner_User_Registration" };

    if (query.entityEmail) {
      query.entityEmail = encryptText(query.entityEmail);
    }

    const response = await getDataWithPage(
      Tokens,
      query,
      {},
      // { populate: "createdUserData" },
      { sort: { createdAt: -1 }, populate: "userData" }
    );

    if (response.result) {
      response.result = response.result.map((v) => {
        v.entityEmail = decryptText(v.entityEmail);

        return v;
      });
    }

    res.send(response);
  } catch (error) {
    next(error);
  }
};
