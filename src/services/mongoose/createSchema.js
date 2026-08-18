import moment from "moment";
import { Schema } from "mongoose";

const DATES = ["joiningDate", "exitDate", "startDate", "endDate"];

export default function createSchema(json) {
  const schema = new Schema(
    {
      ...json
    },
    {
      timestamps: true,
      toJSON: { virtuals: true, versionKey: false },
      toObject: { virtuals: true, versionKey: false }
    }
  );

  schema.pre("findOne", function (next) {
    const query = this.getQuery();

    if (query.email && typeof query.email === "string") {
      query.email = new RegExp(query.email.replace(/\+/g, "\\+"), "i");
    }

    this.where(query);
    next();
  });

  schema.pre("save", function (next) {
    DATES.forEach((v) => {
      if (this[v]) {
        if (v === "date") {
          this[v] = this[v].toString().length >= 8 ? moment(this[v]).format("YYYY-MM-DD") : this[v];
        } else {
          this[v] = moment(this[v]).format("YYYY-MM-DD");
        }
      }
    });

    next();
  });

  schema.pre("findOneAndUpdate", function (next) {
    this.setOptions({ runValidators: true, new: true });
    const updateData = this.getUpdate();
    DATES.forEach((v) => {
      if (updateData[v]) {
        if (v === "date") {
          updateData[v] =
            updateData[v].toString().length >= 8 ? moment(updateData[v]).format("YYYY-MM-DD") : updateData[v];
        } else {
          updateData[v] = moment(updateData[v]).format("YYYY-MM-DD");
        }
      }
    });
    this.setUpdate(updateData);
    next();
  });

  return schema;
}
