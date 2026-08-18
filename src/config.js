/* eslint-disable no-unused-vars */
import path from "path";

/* istanbul ignore next */
if (process.env.NODE_ENV !== "production" && !process.env.DOCKER) {
  // eslint-disable-next-line global-require
  const dotenv = require("dotenv-safe");
  dotenv.config({
    path: path.join(__dirname, "../.env"),
    sample: path.join(__dirname, "../.env.example"),
    allowEmptyValues: true
  });
}

export const env = process.env.NODE_ENV || "development";
export const root = process.cwd();
export const port = process.env.PORT || 4020;
export const ip = process.env.IP || "0.0.0.0";
export const apiRoot = process.env.API_ROOT || "";

export const masterKey = process.env.MASTER_KEY;
export const jwtSecret = process.env.JWT_SECRET;

export const { MAIL_ADDRESS } = process.env;
export const { MAIL_PASSWORD } = process.env;
export const { MAIL_HOST } = process.env;
export const { MAIL_PORT } = process.env;
export const { MAIL_SECURE } = process.env;

export const { MAIL_AUTH } = process.env;
export const { AZURE_TENANT_ID } = process.env;
export const { AZURE_CLIENT_ID } = process.env;
export const { AZURE_CLIENT_SECRET } = process.env;
export const { GRAPH_SENDER } = process.env;

export const { CLIENT_URL } = process.env;
export const { API_URL } = process.env;

export const { CONTACT_US_MAILS } = process.env;

export const { COUNTRY } = process.env;

export const { SEND_GRID_KEY } = process.env;
export const { SEND_GRID_MAIL_ADDRESS } = process.env;

export const { BASE_DIR_PATH = `${path.join(__dirname, "..")}` } = process.env;

export const s3Bucket =
  process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || process.env.BUCKET_NAME || process.env.AWS_BUCKET;

export const s3Config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

export const downloadS3Config = {
  s3Bucket: process.env.DOWNLOAD_S3_BUCKET,
  region: process.env.DOWNLOAD_AWS_REGION,
  credentials: {
    accessKeyId: process.env.DOWNLOAD_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.DOWNLOAD_AWS_SECRET_ACCESS_KEY
  }
};

export const mongo = {
  uri: process.env.MONGO_URI,
  options: {
    useNewUrlParser: true,
    debug: false
  }
};
