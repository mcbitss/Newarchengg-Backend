import mongoose from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const contactusSchema = createSchema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  company: {
    type: String
  },
  phone: {
    type: String
  },
  subject: {
    type: String
  },
  message: {
    type: String
  },
  status: {
    type: String,
    status: ["Open", "Closed"],
    default: "Open"
  }
});

const model = mongoose.model("contactus", contactusSchema);

export default model;
