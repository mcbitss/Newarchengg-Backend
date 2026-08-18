import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Bucket as Bucket, s3Config } from "../config";

const s3 = new S3Client(s3Config);

const requireBucket = () => {
  if (!Bucket) {
    throw new Error("Missing S3 bucket configuration. Set S3_BUCKET or AWS_S3_BUCKET in your environment.");
  }
};

export const uploadBufferToS3 = async (Key, Body, ContentType = "application/octet-stream") => {
  requireBucket();

  const response = await s3.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));

  return response;
};

export const generateSignedUrl = async (Key, expiresIn = 300, overrides = {}) => {
  requireBucket();

  const { responseContentDisposition, responseContentType } = overrides;
  const command = new GetObjectCommand({
    Bucket,
    Key,
    ...(responseContentDisposition && { ResponseContentDisposition: responseContentDisposition }),
    ...(responseContentType && { ResponseContentType: responseContentType })
  });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn });

  return signedUrl;
};

export const getS3Object = async (Key) => {
  requireBucket();

  return s3.send(new GetObjectCommand({ Bucket, Key }));
};

export const getS3Url = (Key) => {
  if (!Bucket || !s3Config?.region) {
    throw new Error("Missing S3 bucket or region configuration");
  }

  const escapedKey = Key.split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  if (s3Config.region === "us-east-1") {
    return `https://${Bucket}.s3.amazonaws.com/${escapedKey}`;
  }

  return `https://${Bucket}.s3.${s3Config.region}.amazonaws.com/${escapedKey}`;
};

export const deleteObject = async (keys) => {
  requireBucket();

  const keyList = Array.isArray(keys) ? keys : [keys];

  const results = await Promise.allSettled(
    keyList.map(async (Key) => {
      await s3.send(new DeleteObjectCommand({ Bucket, Key }));
      console.log(`Deleted object ${Key} from ${Bucket}`);
    })
  );

  const failures = results
    .map((result, index) => ({ result, Key: keyList[index] }))
    .filter(({ result }) => result.status === "rejected");

  if (failures.length > 0) {
    failures.forEach(({ Key, result }) => console.log(`Error deleting ${Key}`, result.reason));
    const failedKeys = failures.map((f) => f.Key).join(", ");
    throw new Error(`Failed to delete ${failures.length} object(s) from S3: ${failedKeys}`);
  }
};

export { deleteObject as deleteS3Object };
