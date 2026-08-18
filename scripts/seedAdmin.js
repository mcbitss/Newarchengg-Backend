import { config } from "dotenv-safe";
import md5 from "md5";
import mongoose from "mongoose";
import path from "path";
import Users from "../src/api/users/model";

config({
  path: path.join(__dirname, "../.env"),
  sample: path.join(__dirname, "../.env.example"),
  allowEmptyValues: true
});

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  process.exit(1);
}

(async () => {
  await mongoose.connect(MONGO_URI);

  const existing = await Users.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
  } else {
    await Users.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: md5(ADMIN_PASSWORD)
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
})();
