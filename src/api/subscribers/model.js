import mongoose from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const subscriberSchema = createSchema({
  name: {
    type: String
  },
  email: {
    type: String
  }
});

const model = mongoose.model("subscribers", subscriberSchema);

export default model;
