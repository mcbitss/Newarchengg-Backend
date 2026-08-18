import mongoose from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const applicationSchema = createSchema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "jobs", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  linkedin: { type: String },
  coverLetter: { type: String },
  resumeUrl: { type: String },
  resumeFilename: { type: String },
  status: { type: String, default: "New" },
  resumeS3Key: {
    type: String,
    required: false
  },
  resumeMimeType: {
    type: String,
    required: false
  },
  resumeSize: {
    type: Number,
    required: false
  }
});

export default mongoose.model("applications", applicationSchema);
