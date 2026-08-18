import mongoose from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const jobSchema = createSchema({
  title: { type: String, required: true },
  department: { type: String },
  location: { type: String },
  type: { type: String },
  description: { type: String },
  requirements: { type: String },
  whatWeOffer: { type: String },
  thumbnail: { type: String },
  status: { type: String, default: "Active" },
  postedDate: { type: Date, default: Date.now }
});

export default mongoose.model("jobs", jobSchema);
