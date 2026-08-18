const decamelize = (str) => (str.charAt(0).toUpperCase() + str.slice(1)).split(/(?=[A-Z])/).join(" ");

const duplicateError = (e) => {
  const checkStr = e.toString().indexOf("_unique") >= 0 ? "_unique" : "_1 dup";
  const path = e.toString().slice(e.toString().indexOf("index: ") + 7, e.toString().indexOf(checkStr));

  return { errors: { [path]: `${decamelize(path)} already exists` } };
};

const validationError = (e) => {
  const errors = {};

  const frameError = ({
    path,
    kind,
    properties: { minlength = "", maxlength = "", enumValues = [] } = {}
  }) => {
    if (kind === "minlength") {
      return `${decamelize(e.path)} should not be minimum ${minlength}`;
    }

    if (kind === "maxlength") {
      return `${decamelize(path)} should not be maximum ${maxlength}`;
    }

    if (kind === "enum") {
      return `${decamelize(path)} should be one of (${enumValues})`;
    }

    if (kind === "required") {
      return `${decamelize(path)} is required`;
    }

    if (kind === "Number") {
      return `${decamelize(path)} should be number`;
    }

    return "";
  };

  Object.values(e.errors).forEach((v) => {
    errors[v.path] = frameError(v);
  });

  return { errors };
};

const customError = (e) => ({
  errors: Array.isArray(e.message)
    ? (() => {
        const errors = {};
        e.message.forEach((item, i) => {
          errors[`error${i}`] = item;
        });

        return errors;
      })()
    : { [e.path]: e.message },
  data: e.data
});

const MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: "File is too large",
  LIMIT_FILE_COUNT: "Too many files",
  LIMIT_UNEXPECTED_FILE: "Unexpected file field"
};

const multerError = (e) => ({
  errors: { file: MULTER_ERROR_MESSAGES[e.code] || e.message }
});

export default (err, req, res, _next) => {
  let errors;

  if (err.name === "MongoError" && err.code === 11000) {
    errors = duplicateError(err, res);
  }

  if (err.name === "ValidationError") {
    errors = validationError(err, res);
  }

  if (err.name === "CustomError") {
    errors = customError(err, res);
  }

  if (err.name === "MulterError") {
    errors = multerError(err);
    err.status = err.status || 400;
  }

  if (res) {
    if (errors) {
      return res.status(err.status || 400).send(errors);
    }

    console.log(err);

    return res.status(500).send({ errors: {} });
  }

  return errors;
};
