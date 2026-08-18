import mongoose from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const mediaSchema = createSchema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  url: { type: String },
  storage: { type: String, enum: ["local", "s3"], default: "local" },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true }
});

export default mongoose.model("media", mediaSchema);
