import Subscribers from "./model";

export const create = async (req, res, next) => {
  try {
    const result = await Subscribers.create(req.body);
    // const { email, name, message, language } = req.body;
    // contactUsEmail({
    //   email,
    //   name,
    //   message,
    //   language
    // });
    res.send({ result });
  } catch (error) {
    next(error);
  }
};

export const getList = async (req, res, next) => {
  try {
    const result = await Subscribers.find({}, {}, { sort: { createdAt: -1 } });
    res.send({ result });
  } catch (error) {
    next(error);
  }
};
