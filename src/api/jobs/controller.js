import { CustomError } from "../../services/Util/Util";
import Job from "./model";

export const getList = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: "Active" }, {}, { sort: { postedDate: -1 } });
    res.send({ result: jobs, error: false });
  } catch (error) {
    next(error);
  }
};

export const getAdminList = async (req, res, next) => {
  try {
    const jobs = await Job.find({}, {}, { sort: { postedDate: -1 } });
    res.send({ result: jobs, error: false });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      throw new CustomError("Job not found", "job", 404);
    }

    res.send({ result: job, error: false });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      status: req.body.status || "Inactive",
      postedDate: req.body.postedDate || new Date()
    };

    const job = await Job.create(payload);
    res.send({ result: job, error: false });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!job) {
      throw new CustomError("Job not found", "job", 404);
    }

    res.send({ result: job, error: false });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      throw new CustomError("Job not found", "job", 404);
    }

    res.send({ result: job, error: false });
  } catch (error) {
    next(error);
  }
};
