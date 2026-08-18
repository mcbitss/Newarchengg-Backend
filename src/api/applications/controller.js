import path from "path";
import { v4 as uuid } from "uuid";
import { getS3Object, uploadBufferToS3 } from "../../services/s3";
import { CustomError } from "../../services/Util/Util";
import Job from "../jobs/model";
import Application from "./model";

export const listApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({}, {}, { sort: { createdAt: -1 } }).populate("job");
    res.send({ result: applications, error: false });
  } catch (error) {
    next(error);
  }
};

export const getApplicationsByJob = async (req, res, next) => {
  try {
    const applications = await Application.find(
      { job: req.params.id },
      {},
      { sort: { createdAt: -1 } }
    ).populate("job");
    res.send({ result: applications, error: false });
  } catch (error) {
    next(error);
  }
};

export const applyJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      throw new CustomError("Job not found", "job", 404);
    }

    const applicationData = {
      job: job._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      linkedin: req.body.linkedin,
      coverLetter: req.body.coverLetter,
      status: "New"
    };

    // ✅ Handle file upload to S3
    if (req.file) {
      const originalName = req.file.originalname;
      const ext = path.extname(originalName).toLowerCase();
      const filename = `${uuid()}${ext}`;
      // Organize resumes by job ID and candidate email for easy management
      const sanitizedEmail = req.body.email.replace(/[^a-zA-Z0-9@.]/g, "_");
      const s3Key = `resumes/${job._id}/${sanitizedEmail}/${filename}`;

      // Upload to S3
      await uploadBufferToS3(s3Key, req.file.buffer, req.file.mimetype);

      // Store only the S3 key in the database (NOT the raw URL)
      // The raw URL is private and won't work. We'll generate signed URLs when viewing.
      applicationData.resumeS3Key = s3Key;
      applicationData.resumeFilename = originalName;
      applicationData.resumeMimeType = req.file.mimetype;
      applicationData.resumeSize = req.file.size;
    }

    const application = await Application.create(applicationData);
    res.send({ result: application, error: false });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("job");

    if (!application) {
      throw new CustomError("Application not found", "application", 404);
    }

    res.send({ result: application, error: false });
  } catch (error) {
    next(error);
  }
};

export const getApplicationResume = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      throw new CustomError("Application not found", 404);
    }

    if (!application.resumeS3Key) {
      throw new CustomError("No resume uploaded", 404);
    }

    const isDownload = req.query.download === "true";
    const safeFilename = (application.resumeFilename || "resume").replace(/["\r\n]/g, "");

    // Stream the object through our own server (rather than redirecting to a
    // presigned S3 URL) so the browser's authenticated fetch never has to
    // follow a cross-origin redirect that the S3 bucket's CORS policy would block.
    const object = await getS3Object(application.resumeS3Key);

    res.setHeader(
      "Content-Type",
      object.ContentType || application.resumeMimeType || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `${isDownload ? "attachment" : "inline"}; filename="${safeFilename}"`
    );

    if (object.ContentLength) {
      res.setHeader("Content-Length", object.ContentLength);
    }

    object.Body.pipe(res);
  } catch (error) {
    next(error);
  }
};
