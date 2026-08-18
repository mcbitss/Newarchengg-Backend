import Partners from "./model";

export const create = async (req, res, next) => {
  try {
    const result = await Partners.create(req.body);
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
    const result = await Partners.find({}, {}, { sort: { createdAt: -1 } });
    res.send({ result });
  } catch (error) {
    next(error);
  }
};
