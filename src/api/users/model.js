import mongoose from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const userSchema = createSchema({
  name: {
    type: String
  },
  email: {
    type: String,
    maxLength: 256
  },
  mobile: {
    type: String,
    maxLength: 50
  },
  password: {
    type: String,
    maxLength: 50
  }
});

export default mongoose.model("users", userSchema);
