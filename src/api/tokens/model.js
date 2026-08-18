import mongoose, { Schema } from "mongoose";
import createSchema from "../../services/mongoose/createSchema";

const tokenSchema = createSchema({
  partner: {
    type: Schema.Types.ObjectId
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: "companies"
  },
  doctor: {
    type: Schema.Types.ObjectId
  },
  user: {
    type: Schema.Types.ObjectId
  },
  role: {
    type: Schema.Types.ObjectId
  },
  entityType: {
    type: String,
    maxLength: 50
  },
  entityId: {
    type: Schema.Types.ObjectId
  },
  entityReference: {
    type: String
  },
  entityEmail: {
    type: String,
    maxLength: 256
  },
  token: {
    type: String,
    maxLength: 100
  },
  otp: {
    type: String
  },
  expiryDate: {
    type: Date
  },
  status: {
    type: String,
    default: "Active",
    enum: ["Active", "InActive"]
  }
});

tokenSchema.virtual("userData", {
  ref: "users",
  localField: "user",
  foreignField: "_id",
  justOne: true
});

export default mongoose.model("tokens", tokenSchema);
