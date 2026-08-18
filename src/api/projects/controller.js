import { CustomError } from "../../services/Util/Util";
import Project from "./model";

export const getList = async (req, res, next) => {
  try {
    const projects = await Project.find({}, {}, { sort: { createdAt: -1 } });
    res.send(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.send(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!project) {
      throw new CustomError("Project not found", "project", 404);
    }

    res.send(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      throw new CustomError("Project not found", "project", 404);
    }

    res.send(project);
  } catch (error) {
    next(error);
  }
};
