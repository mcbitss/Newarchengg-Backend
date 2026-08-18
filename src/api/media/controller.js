import path from "path";
import { v4 as uuid } from "uuid";
import { deleteS3Object, generateSignedUrl, getS3Url, uploadBufferToS3 } from "../../services/s3";
import { CustomError } from "../../services/Util/Util";
import Media from "./model";

export const listMedia = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.year) {
      filter.year = Number(req.query.year);
    }

    if (req.query.month) {
      filter.month = Number(req.query.month);
    }

    if (req.query.day) {
      filter.day = Number(req.query.day);
    }

    const media = await Media.find(filter).sort({ createdAt: -1 });

    // ✅ Generate pre‑signed URLs using your centralized function
    const mediaWithSignedUrls = await Promise.all(
      media.map(async (item) => {
        const obj = item.toObject ? item.toObject() : { ...item };

        // Just call your new helper – no need to import GetObjectCommand here
        obj.url = await generateSignedUrl(obj.filePath);

        return obj;
      })
    );

    res.send({ result: mediaWithSignedUrls, error: false });
  } catch (error) {
    next(error);
  }
};

export const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new CustomError("No files uploaded");
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const saved = await Promise.all(
      req.files.map(async (file) => {
        const monthPadded = String(month).padStart(2, "0");
        const dayPadded = String(day).padStart(2, "0");
        const filename = `${uuid()}${path.extname(file.originalname).toLowerCase()}`;
        const filePath = `${year}/${monthPadded}/${dayPadded}/${filename}`;
        const url = getS3Url(filePath);

        await uploadBufferToS3(filePath, file.buffer, file.mimetype);

        return Media.create({
          originalName: file.originalname,
          filename,
          filePath,
          url,
          storage: "s3",
          mimeType: file.mimetype,
          size: file.size,
          year,
          month,
          day
        });
      })
    );

    res.send({ result: saved, error: false });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      throw new CustomError("File not found", false, 404);
    }

    if (media.storage === "s3") {
      await deleteS3Object(media.filePath);
    }

    await Media.findByIdAndDelete(id);
    res.send({ result: media, error: false });
  } catch (error) {
    next(error);
  }
};
