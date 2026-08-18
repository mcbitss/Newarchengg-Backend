import CryptoJS from "crypto-js";
import _ from "lodash";
import moment from "moment";
import mongoose from "mongoose";
import XLSX from "xlsx";
import { convertUserData } from "../../api/users/controller";

const key = "55a51621a6648525";
const keyutf = CryptoJS.enc.Utf8.parse(key);
const iv = CryptoJS.enc.Base64.parse(key);

const _isEmpty = require("lodash/isEmpty");

export const PAGE_LIMIT = 10;

// eslint-disable-next-line import/no-mutable-exports, no-var
export var TRANSLATIONS = {};

export const translateText = (value, language = "de") =>
  TRANSLATIONS[value] ? TRANSLATIONS[value][language] || value : value;

export const translateTextDynamic = (value, language = "de") => {
  const arr = [
    { from: "<T1>", to: "</T1>", variable: "t1" },
    { from: "<T2>", to: "</T2>", variable: "t2" },
    { from: "<T3>", to: "</T3>", variable: "t3" },
    { from: "<T4>", to: "</T4>", variable: "t4" },
    { from: "<T5>", to: "</T5>", variable: "t5" }
  ];

  const getDynamicText = (text) => {
    const obj = {};
    let newText = text;

    arr.forEach((v) => {
      let startPosition = newText.search(v.from);

      if (startPosition >= 0) {
        startPosition += 4;
      }

      const endPosition = newText.search(v.to);

      if (startPosition > 0 && endPosition > 0) {
        const extractedValue = newText.slice(startPosition, endPosition);
        obj[v.variable] = { label: `${v.from}${v.to}`, value: extractedValue };
        newText = newText.replace(`${v.from}${extractedValue}${v.to}`, `${v.from}${v.to}`);
      }
    });

    return { newText, obj };
  };

  const renderText = (txt) => {
    const { newText, obj = {} } = getDynamicText(txt);
    let translatedText = translateText(newText, language);
    Object.values(obj).forEach((v) => {
      translatedText = translatedText.replace(v.label, v.value);
    });

    return translatedText;
  };

  return renderText(value);
};

export const validateAccess = (accessData, page, withPath) => {
  if (accessData && page) {
    if (typeof page === "string") {
      return accessData.includes(
        withPath ? page.substr(5, page.indexOf(":") > 0 ? page.indexOf("/:") - 5 : page.length) : page
      );
    }

    return page.filter((e) => accessData.includes(e)).length > 0;
  }

  return undefined;
};

export const convertToObjectId = (id) =>
  id ? mongoose.Types.ObjectId.createFromHexString(id.toString()) : id;

export const amountSeparator = (value) => {
  const amount = value ? parseFloat(value).toFixed(2) : "0.00";

  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getNoOfWorkingDays = (value) => {
  const amount = value ? parseFloat(value).toFixed(2) : "0.00";

  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const removeEmpty = (values) => _(values).omitBy(_.isEmpty).value();

export const removeEmptyKeys = (values) => {
  const newValue = {};
  Object.keys(values).forEach((val) => {
    const checkArr = typeof values[val] === "object" ? Object.keys(values[val] || []).length > 0 : true;

    if (values[val] !== "" && values[val] !== 0 && checkArr) {
      newValue[val] = values[val];
    }
  });

  return newValue;
};

export const weekFormat = ({ startWeekDate, endWeekDate, month, year }) => {
  const weekDate = new Date(`${year}-${month}-${endWeekDate}`);

  return `${startWeekDate} - ${moment(weekDate).format("DD MMM YYYY")}`;
};

export const getTotalPages = (resCount, limit) => Math.ceil(resCount / limit);

export const getCurrentPageCount = (offset, totalCount) => Math.ceil(offset / totalCount + 1);

export const getPaginatedResult = async (schema, query, _options) => {
  const offset = query.offset ? parseInt(query.offset, 10) : 0;
  const limits = parseInt(query.limit, 10);
  const searchQuery = { network: query.network, company: query.company };

  const response = await schema.find(searchQuery).skip(offset).limit(limits);

  if (!_isEmpty(response)) {
    const count = await schema.countDocuments();

    return {
      success: true,
      message: "Success",
      result: {
        data: response,
        total: count,
        page: getCurrentPageCount(offset, count),
        pages: getTotalPages(count, limits)
      }
    };
  }

  return { success: true, message: "No Content", result: { data: [] } };
};

const DEFAULT_PER_PAGE = 10;

export const getAggregatePage = async (schema, pipeline = [], query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.perPage, 10) || DEFAULT_PER_PAGE;
  const offset = (page - 1) * limit;

  const response = schema.aggregate(
    pipeline.concat([
      {
        $facet: {
          paginatedResults: [{ $skip: offset }, { $limit: limit }],
          totalCount: [
            {
              $count: "count"
            }
          ]
        }
      }
    ])
  );
  const [result] = await response;

  if (!_isEmpty(result)) {
    return {
      success: true,
      result: result.paginatedResults,
      pageData: { page, perPage: limit, totalCount: result.totalCount[0]?.count }
    };
  }

  return { success: true, result: [] };
};

export const wildCardQuery = (query, schema, skipWildCard = ["status"]) => {
  Object.entries(query).forEach(([fieldKey, value]) => {
    if (
      !skipWildCard.includes(fieldKey) &&
      typeof value === "string" &&
      schema.schema.path(fieldKey)?.instance === "String"
    ) {
      query[fieldKey] = new RegExp(value?.trim(), "i");
    }
  });

  return query;
};

export const regexQuery = (filterQuery) => {
  Object.entries(filterQuery).forEach(([fieldKey, value]) => {
    if (
      typeof value === "string" &&
      !["partner", "business", "user", "page", "perPage", "totalCount", "exportType"].includes(fieldKey) &&
      !["true", "false"].includes(value) &&
      !/date/i.test(fieldKey) &&
      !/from/i.test(fieldKey) &&
      !/to/i.test(fieldKey)
    ) {
      filterQuery[fieldKey] = new RegExp(value?.trim(), "i");
    }
  });

  return filterQuery;
};

export const getDataWithPage = async (schema, { skipWildCard, ...query }, select, options, method) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.perPage, 10) || DEFAULT_PER_PAGE;
  const offset = (page - 1) * limit;
  delete query.page;
  delete query.perPage;
  delete query.totalCount;
  let response = await schema
    .find(wildCardQuery(query, schema, skipWildCard) || {}, select || {}, options || {})
    .skip(offset)
    .limit(limit);

  if (!_isEmpty(response)) {
    const count = await schema.countDocuments(query);

    if (response[0]?.userData || response[0]?.createdByData) {
      response = response.map((v) => {
        v.userData = v.userData ? convertUserData(v.userData) : {};
        v.createdByData = v.createdByData ? convertUserData(v.createdByData) : {};

        return v;
      });
    }

    return {
      success: true,
      result: method ? response.map((v) => v[method]()) : response,
      pageData: { page, perPage: limit, totalCount: count }
    };
  }

  return { success: true, result: [] };
};

export const getDataWithPageByIndex = async (schema, { skipWildCard, ...query }, select, options, method) => {
  const limit = parseInt(query.perPage, 10) || DEFAULT_PER_PAGE;

  if (query.pageIndex) {
    query._id = { [options.sortOrder || "$gt"]: query.pageIndex };
  }

  delete query.pageIndex;
  let response = await schema
    .find(wildCardQuery(query, schema, skipWildCard) || {}, select || {}, options || {})
    .limit(limit);

  if (!_isEmpty(response)) {
    if (response[0]?.userData) {
      response = response.map((v) => {
        v.userData = v.userData ? convertUserData(v.userData) : {};

        return v;
      });
    }

    return {
      result: method ? response.map((v) => v[method]()) : response
    };
  }

  return { result: [] };
};

/* eslint-disable no-extend-native, func-names */
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.isNumber = function () {
  return /^[0-9]*$/gm.test(this);
};
/* eslint-enable no-extend-native, func-names */

export class CustomError extends Error {
  constructor(message, path, status) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = status;
    this.path = path || "err";

    if (typeof message === "object" && message?.data) {
      this.message = message.message;
      this.data = message.data;
    } else {
      this.message = message;
    }
  }
}

export const roundOf = (value, decimals) => Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);

export const validateFileName = (name) => name.replace(/[^a-zA-Z0-9-]/g, "_");

export const getUserEntityType = (entityType) => {
  switch (entityType) {
    case "Partner_User_Registration":
      return "Partner";
    case "Business_User_Registration":
      return "Business";
    default:
      return "Patient";
  }
};

export const encryptText = (text) => {
  if (text) {
    const enc = CryptoJS.AES.encrypt(text, keyutf, { iv });
    const encStr = enc.toString();

    return encStr;
  }

  return text;
};

export const decryptText = (text) => {
  if (text) {
    const dec = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(text) }, keyutf, {
      iv
    });
    const decStr = CryptoJS.enc.Utf8.stringify(dec);

    return decStr;
  }

  return text;
};

export const convertToExcel = (fields = [], values = [], sheetName = "Sheet1", bookType = "xlsx") => {
  const rows = fields.filter((v) => !v.dontShow);
  const wsData = [rows.map((v) => v.label)];
  values.forEach((val) => wsData.push(rows.map((v) => v.value(val) || "")));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  return XLSX.write(wb, { type: "buffer", bookType });
};

export const doRecursive = (arr, customFn, timeout = 300) =>
  new Promise((resolve) => {
    let index = 0;

    const renderFn = (item) => {
      if (arr.length > index) {
        customFn(item);
        setTimeout(() => {
          index += 1;
          renderFn(arr[index]);
        }, timeout);
      } else {
        resolve(true);
      }
    };

    renderFn(arr[index]);
  });

export const formatDate = (date, withTime) =>
  date ? moment(date).format(withTime ? "DD.MM.YYYY HH:mm" : "DD.MM.YYYY") : "";

export const generateOTP = (length = 6) => {
  const result = [];
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i += 1) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return result.join("");
};

export const decamelize = (text = "") =>
  (text.charAt(0).toUpperCase() + text.slice(1)).split(/(?=[A-Z])/).join(" ");
