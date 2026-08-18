import mongoose from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const projectSchema = createSchema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  year: { type: Number },
  client: { type: String },
  category: { type: String, enum: ["residential", "villa", "commercial", "mixed"], default: "residential" },
  image: { type: String, required: true },
  tags: { type: [String], default: [] },
  highlight: { type: Boolean, default: false }
});

export default mongoose.model("projects", projectSchema);
