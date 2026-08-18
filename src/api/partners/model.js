import mongoose from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const partnerSchema = createSchema({
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
  location: {
    type: String
  },
  message: {
    type: String
  }
});

const model = mongoose.model("partners", partnerSchema);

export default model;
