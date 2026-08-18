import { contactUsEmail } from "../../services/email/email";
import { CustomError } from "../../services/Util/Util";
import Contactus from "./model";

export const updateContactUsAdmin = async (req, res, next) => {
  try {
    const { message, status } = req.body;
    const result = await Contactus.findOneAndUpdate({ _id: req.params.id }, { message, status });
    res.send({ result });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await Contactus.create(req.body);
    const { email, name, message, language } = req.body;
    contactUsEmail({
      email,
      name,
      message,
      language
    });
    res.send({ result });
  } catch (error) {
    next(error);
  }
};

export const getList = async (req, res, next) => {
  try {
    const result = await Contactus.find({}, {}, { sort: { createdAt: -1 } });
    res.send({ result });
  } catch (error) {
    next(error);
  }
};

export const deleteContactUs = async (req, res, next) => {
  try {
    const result = await Contactus.findByIdAndDelete(req.params.id);

    if (!result) {
      throw new CustomError("Contact not found", "contact", 404);
    }

    res.send({ result });
  } catch (error) {
    next(error);
  }
};
